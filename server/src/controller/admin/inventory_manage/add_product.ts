import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Admin_Product } from '../../../models/product.js';
import { Admin_Category } from '../../../models/category.js';
import { add_product_schema } from '../../../validations/catalog.js';
import { generate_slug } from './add_category.js';
import {
  extract_multer_files,
  upload_multiple_to_cloudinary,
} from '../../../utils/upload_on_cloudinary.js';

export async function add_product(req: Request, res: Response): Promise<void> {
  try {
    // Parse numeric/JSON/boolean inputs passed as multipart/form-data strings
    const body_data = { ...req.body };
    if (typeof body_data.original_price === 'string') body_data.original_price = Number(body_data.original_price);
    if (typeof body_data.current_price === 'string') body_data.current_price = Number(body_data.current_price);
    if (typeof body_data.stock === 'string') body_data.stock = Number(body_data.stock);
    if (typeof body_data.discount_percentage === 'string') body_data.discount_percentage = Number(body_data.discount_percentage);

    if (typeof body_data.is_it_featured === 'string') body_data.is_it_featured = body_data.is_it_featured === 'true';
    if (typeof body_data.is_active === 'string') body_data.is_active = body_data.is_active === 'true';
    if (typeof body_data.is_in_stock === 'string') body_data.is_in_stock = body_data.is_in_stock === 'true';

    if (typeof body_data.highlights === 'string') {
      try { body_data.highlights = JSON.parse(body_data.highlights); } catch { body_data.highlights = []; }
    }
    if (Array.isArray(body_data.highlights)) {
      body_data.highlights = body_data.highlights.filter(
        (h: any) => h && typeof h.title === 'string' && h.title.trim() !== '' && typeof h.description === 'string' && h.description.trim() !== ''
      );
    }

    if (typeof body_data.specifications === 'string') {
      try { body_data.specifications = JSON.parse(body_data.specifications); } catch { body_data.specifications = []; }
    }
    if (Array.isArray(body_data.specifications)) {
      body_data.specifications = body_data.specifications
        .map((cat: any) => ({
          category_name: cat?.category_name || 'General',
          specs: Array.isArray(cat?.specs)
            ? cat.specs.filter((s: any) => s && s.key && s.key.trim() !== '' && s.value && s.value.trim() !== '')
            : [],
        }))
        .filter((cat: any) => cat.specs.length > 0);
    }

    if (typeof body_data.faqs === 'string') {
      try { body_data.faqs = JSON.parse(body_data.faqs); } catch { body_data.faqs = []; }
    }
    if (Array.isArray(body_data.faqs)) {
      body_data.faqs = body_data.faqs.filter(
        (f: any) => f && typeof f.question === 'string' && f.question.trim() !== '' && typeof f.answer === 'string' && f.answer.trim() !== ''
      );
    }

    const parse_result = add_product_schema.safeParse(body_data);
    if (!parse_result.success) {
      const fieldErrors = parse_result.error.flatten().fieldErrors;
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errs]) => `${field}: ${(errs || []).join(', ')}`)
        .join('; ');
      res.status(400).json({
        success: false,
        message: errorMessages ? `Validation failed: ${errorMessages}` : 'Validation failed.',
        errors: fieldErrors,
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
      category_id: input_cat_id,
      brand,
      is_in_stock,
      is_it_featured,
      is_active,
      highlights,
      specifications,
      faqs,
    } = parse_result.data;

    // Resolve category (support MongoDB ObjectId as well as mock category IDs)
    let category = null;
    let final_category_id = input_cat_id;

    if (Types.ObjectId.isValid(input_cat_id)) {
      category = await Admin_Category.findById(input_cat_id);
    } else {
      category = await Admin_Category.findOne({ $or: [{ slug: input_cat_id }, { name: input_cat_id }] });
    }

    if (!category) {
      const first_cat = await Admin_Category.findOne({ is_deleted: false });
      if (first_cat) {
        category = first_cat;
        final_category_id = first_cat._id.toString();
      } else {
        // Create a default category if database has none
        const default_cat = new Admin_Category({
          name: 'General',
          slug: 'general',
          description: 'General Product Category',
          is_active: true,
        });
        await default_cat.save();
        category = default_cat;
        final_category_id = default_cat._id.toString();
      }
    } else {
      final_category_id = category._id.toString();
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
    const uploaded_media: { public_id: string; secure_url: string; resource_type: string }[] = [];

    const { all_files, files_by_field } = extract_multer_files(req);

    const thumbnail_files = files_by_field.get('thumbnail');
    if (!thumbnail_files) {
      res.status(400).json({
        success: false,
        message: 'please provide thumbnail.',
      });
      return;
    }
    if (thumbnail_files && thumbnail_files.length > 0) {
      const thumb_uploads = await upload_multiple_to_cloudinary(
        thumbnail_files,
        `admin/products/${slug}/thumbnail`
      );
      if (thumb_uploads.length > 0) {
        thumbnail_url = thumb_uploads[0].secure_url;
        uploaded_media.push(...thumb_uploads);
      }
    }

    const media_files = all_files.filter((f) => f.fieldname !== 'thumbnail');

    if (!all_files.length) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      });
      return;
    }

    if (media_files.length > 0) {
      const gallery_uploads = await upload_multiple_to_cloudinary(
        media_files,
        `${process.env.STORE_NAME}/admin/products/${slug}/media`
      );
      uploaded_media.push(...gallery_uploads);
    }

    if (!thumbnail_url && uploaded_media.length > 0) {
      thumbnail_url = uploaded_media[0].secure_url;
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
      category_id: final_category_id,
      brand,
      media: uploaded_media,
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
