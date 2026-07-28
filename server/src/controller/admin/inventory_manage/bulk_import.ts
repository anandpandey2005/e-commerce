import { Request, Response } from 'express';
import { Product } from '../../../models/product.js';
import { Category } from '../../../models/category.js';
import { generate_slug } from './add_category.js';
import { upload_to_cloudinary } from '../../../utils/upload_on_cloudinary.js';

interface BulkCategoryImport {
  name: string;
  description?: string;
  media?: { secure_url: string; public_id: string }[];
}

interface BulkProductImport {
  name: string;
  description: string;
  original_price: number;
  current_price: number;
  discount_percentage?: number;
  sku: string;
  stock: number;
  category_name?: string;
  category_id?: string;
  brand: string;
  media?: { secure_url: string; public_id: string }[];
  thumbnail?: string;
  highlights?: { title: string; description: string }[];
  specifications?: { category_name: string; specs: { key: string; value: string }[] }[];
  faqs?: { question: string; answer: string; asked_by?: string }[];
}

interface BulkImportPayload {
  categories?: BulkCategoryImport[];
  products: BulkProductImport[];
}

async function send_bulk_import_notification_email(
  admin_email: string,
  summary: { categories_created: number; products_created: number; errors: string[] }
): Promise<void> {
  console.log(`[EMAIL DISPATCH] To: ${admin_email}`);
  console.log(`[EMAIL DISPATCH] Subject: Bulk Inventory Import Processed Successfully`);
  console.log(
    `[EMAIL DISPATCH] Body: Processed ${summary.categories_created} new categories and ${summary.products_created} products. Errors encountered: ${summary.errors.length}`
  );
}

export async function bulk_import(req: Request, res: Response): Promise<void> {
  try {
    let import_data: BulkImportPayload | null = null;

    // Check if JSON file was uploaded via Multer
    if (req.file) {
      const file_content = req.file.buffer.toString('utf-8');
      import_data = JSON.parse(file_content);
    } else if (req.body && (req.body.products || req.body.categories)) {
      import_data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } else if (req.body && Array.isArray(req.body)) {
      import_data = { products: req.body };
    }

    if (!import_data || !Array.isArray(import_data.products)) {
      res.status(400).json({
        success: false,
        message: 'Invalid bulk import payload. Expected JSON containing "products" array.',
      });
      return;
    }

    const categories_created: string[] = [];
    const products_created: string[] = [];
    const errors: string[] = [];

    // 1. Process explicit categories if included
    if (import_data.categories && Array.isArray(import_data.categories)) {
      for (const cat_item of import_data.categories) {
        try {
          if (!cat_item.name) continue;
          const slug = generate_slug(cat_item.name);
          let existing = await Category.findOne({ slug });
          if (!existing) {
            existing = new Category({
              name: cat_item.name,
              slug,
              description: cat_item.description || '',
              media: cat_item.media || [],
              is_active: true,
            });
            await existing.save();
            categories_created.push(cat_item.name);
          }
        } catch (cat_err: any) {
          errors.push(`Failed to create category ${cat_item.name}: ${cat_err.message}`);
        }
      }
    }

    // 2. Process products
    for (const prod_item of import_data.products) {
      try {
        if (!prod_item.name || !prod_item.sku) {
          errors.push(`Skipped product without name or SKU.`);
          continue;
        }

        const product_slug = generate_slug(prod_item.name);

        // Check if SKU already exists
        const existing_product = await Product.findOne({ sku: prod_item.sku });
        if (existing_product) {
          errors.push(`Product with SKU '${prod_item.sku}' already exists. Skipping.`);
          continue;
        }

        // Find or Auto-Create Category if it does not exist
        let category_doc = null;
        if (prod_item.category_id) {
          category_doc = await Category.findById(prod_item.category_id);
        }

        if (!category_doc && prod_item.category_name) {
          const cat_slug = generate_slug(prod_item.category_name);
          category_doc = await Category.findOne({ slug: cat_slug });

          // Auto-create category if missing
          if (!category_doc) {
            category_doc = new Category({
              name: prod_item.category_name,
              slug: cat_slug,
              description: `Auto-created category for ${prod_item.category_name}`,
              is_active: true,
            });
            await category_doc.save();
            categories_created.push(prod_item.category_name);
          }
        }

        if (!category_doc) {
          // Default fallback category if none provided
          let default_cat = await Category.findOne({ slug: 'uncategorized' });
          if (!default_cat) {
            default_cat = new Category({
              name: 'Uncategorized',
              slug: 'uncategorized',
              description: 'Default category for imported products',
              is_active: true,
            });
            await default_cat.save();
          }
          category_doc = default_cat;
        }

        const stock = prod_item.stock || 0;
        const orig_price = prod_item.original_price || prod_item.current_price || 0;
        const curr_price = prod_item.current_price || 0;
        const discount =
          prod_item.discount_percentage !== undefined
            ? prod_item.discount_percentage
            : orig_price > 0 && curr_price < orig_price
            ? Math.round(((orig_price - curr_price) / orig_price) * 100)
            : 0;

        let stock_flag: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' = 'IN_STOCK';
        if (stock === 0) stock_flag = 'OUT_OF_STOCK';
        else if (stock <= 5) stock_flag = 'LOW_STOCK';

        const product = new Product({
          name: prod_item.name,
          slug: product_slug,
          description: prod_item.description || prod_item.name,
          original_price: orig_price,
          current_price: curr_price,
          discount_percentage: discount,
          sku: prod_item.sku,
          stock,
          is_in_stock: stock > 0,
          category_id: category_doc._id,
          brand: prod_item.brand || 'Generic',
          media: prod_item.media || [],
          thumbnail: prod_item.thumbnail || (prod_item.media && prod_item.media[0] ? prod_item.media[0].secure_url : 'https://via.placeholder.com/300x300.png?text=Product'),
          highlights: prod_item.highlights || [],
          specifications: prod_item.specifications || [],
          faqs: prod_item.faqs || [],
          stock_availabilty_flag: stock_flag,
          is_active: true,
        });

        await product.save();
        products_created.push(prod_item.name);
      } catch (prod_err: any) {
        errors.push(`Failed to import product '${prod_item.name}': ${prod_err.message}`);
      }
    }

    // 3. Send Notification Email
    const admin_email = (req as any).user?.email || 'anandpandey20005@gmail.com';
    await send_bulk_import_notification_email(admin_email, {
      categories_created: categories_created.length,
      products_created: products_created.length,
      errors,
    });

    res.status(200).json({
      success: true,
      message: 'Bulk import processed successfully.',
      data: {
        categories_created_count: categories_created.length,
        products_created_count: products_created.length,
        errors_count: errors.length,
        errors,
      },
    });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'An unexpected system error occurred.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'An unexpected system error occurred.',
    });
    return;
  }
}
