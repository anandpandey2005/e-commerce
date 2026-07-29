import { Request, Response } from 'express';
import { Admin_Product } from '../../../models/product.js';
import { Admin_Category } from '../../../models/category.js';
import { add_product_schema } from '../../../validations/catalog.js';
import { generate_slug } from './add_category.js';
import { upload_to_cloudinary } from '../../../utils/upload_on_cloudinary.js';

export async function add_product(req: Request, res: Response): Promise<void> {
  try {
    // Parse numeric/JSON inputs if passed as multipart/form-data strings
    const body_data = { ...req.body };
    if (typeof body_data.original_price === 'string') body_data.original_price = Number(body_data.original_price);
    if (typeof body_data.current_price === 'string') body_data.current_price = Number(body_data.current_price);
    if (typeof body_data.stock === 'string') body_data.stock = Number(body_data.stock);
    if (typeof body_data.discount_percentage === 'string') body_data.discount_percentage = Number(body_data.discount_percentage);
    if (typeof body_data.highlights === 'string') {
      try { body_data.highlights = JSON.parse(body_data.highlights); } catch { body_data.highlights = []; }
    }
    if (typeof body_data.specifications === 'string') {
      try { body_data.specifications = JSON.parse(body_data.specifications); } catch { body_data.specifications = []; }
    }
    if (typeof body_data.faqs === 'string') {
      try { body_data.faqs = JSON.parse(body_data.faqs); } catch { body_data.faqs = []; }
    }

    const parse_result = add_product_schema.safeParse(body_data);
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      name,
      description,
      original_price,
      current_price,
      sku,
      stock,
      category_id,
      brand,
      is_in_stock,
      is_it_featured,
      is_active,
      highlights,
      specifications,
      faqs,
    } = parse_result.data;

    // Verify category exists
    const category = await Admin_Category.findById(category_id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: `Category with ID '${category_id}' not found.`,
      });
      return;
    }

    // Generate unique slug & check SKU uniqueness
    const slug = generate_slug(name);
    const existing_sku = await Admin_Product.findOne({ sku });
    if (existing_sku) {
      res.status(400).json({
        success: false,
        message: `Product with SKU '${sku}' already exists.`,
      });
      return;
    }

    // Auto-calculate discount percentage
    const discount_percentage =
      parse_result.data.discount_percentage !== undefined
        ? parse_result.data.discount_percentage
        : original_price > 0 && current_price < original_price
        ? Math.round(((original_price - current_price) / original_price) * 100)
        : 0;

    // Stock availability status flag
    let stock_availabilty_flag: 'IN_STOCK' | 'OUT_OF_STOCK' | 'LOW_STOCK' = 'IN_STOCK';
    if (stock === 0) {
      stock_availabilty_flag = 'OUT_OF_STOCK';
    } else if (stock <= 5) {
      stock_availabilty_flag = 'LOW_STOCK';
    }

    let thumbnail_url = '';
    const media: { public_id: string; secure_url: string; resource_type: string }[] = [];

    // Process file uploads via Multer
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    if (files) {
      if (Array.isArray(files)) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const upload_res = await upload_to_cloudinary(file.buffer, `products/${slug}/${file.originalname}`);
          media.push(upload_res);
          if (i === 0) thumbnail_url = upload_res.secure_url;
        }
      } else if (typeof files === 'object') {
        if (files['thumbnail'] && files['thumbnail'][0]) {
          const thumb_res = await upload_to_cloudinary(
            files['thumbnail'][0].buffer,
            `products/${slug}/thumbnail_${files['thumbnail'][0].originalname}`
          );
          thumbnail_url = thumb_res.secure_url;
          media.push(thumb_res);
        }
        if (files['media']) {
          for (const file of files['media']) {
            const upload_res = await upload_to_cloudinary(file.buffer, `products/${slug}/${file.originalname}`);
            media.push(upload_res);
          }
        }
      }
    } else if (req.file) {
      const upload_res = await upload_to_cloudinary(req.file.buffer, `products/${slug}/${req.file.originalname}`);
      thumbnail_url = upload_res.secure_url;
      media.push(upload_res);
    }

    if (!thumbnail_url) {
      thumbnail_url = 'https://via.placeholder.com/300x300.png?text=Product';
    }

    const product = new Admin_Product({
      name,
      slug,
      description,
      original_price,
      current_price,
      discount_percentage,
      sku,
      stock,
      is_in_stock: is_in_stock !== undefined ? is_in_stock : stock > 0,
      is_it_featured: is_it_featured || false,
      category_id,
      brand,
      media,
      thumbnail: thumbnail_url,
      highlights,
      specifications,
      faqs,
      stock_availabilty_flag,
      is_active: is_active !== undefined ? is_active : true,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      data: { product },
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
