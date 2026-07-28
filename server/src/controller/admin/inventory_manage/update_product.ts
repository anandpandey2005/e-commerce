import { Request, Response } from 'express';
import { Product } from '../../../models/product.js';
import { Category } from '../../../models/category.js';
import { update_product_schema } from '../../../validations/catalog.js';
import { generate_slug } from './add_category.js';
import { upload_to_cloudinary } from '../../../utils/upload_on_cloudinary.js';

export async function update_product(req: Request, res: Response): Promise<void> {
  try {
    const body_data = { ...req.body };
    if (typeof body_data.original_price === 'string') body_data.original_price = Number(body_data.original_price);
    if (typeof body_data.current_price === 'string') body_data.current_price = Number(body_data.current_price);
    if (typeof body_data.stock === 'string') body_data.stock = Number(body_data.stock);
    if (typeof body_data.discount_percentage === 'string') body_data.discount_percentage = Number(body_data.discount_percentage);

    const parse_result = update_product_schema.safeParse(body_data);
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const {
      _id,
      name,
      description,
      original_price,
      current_price,
      discount_percentage,
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

    const product = await Product.findById(_id);
    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
      return;
    }

    if (category_id !== undefined) {
      const category = await Category.findById(category_id);
      if (!category) {
        res.status(404).json({
          success: false,
          message: `Category with ID '${category_id}' not found.`,
        });
        return;
      }
      product.category_id = category_id as any;
    }

    if (name !== undefined) {
      product.name = name;
      product.slug = generate_slug(name);
    }
    if (description !== undefined) product.description = description;
    if (original_price !== undefined) product.original_price = original_price;
    if (current_price !== undefined) product.current_price = current_price;
    if (sku !== undefined) product.sku = sku;
    if (stock !== undefined) {
      product.stock = stock;
      if (stock === 0) product.stock_availabilty_flag = 'OUT_OF_STOCK';
      else if (stock <= 5) product.stock_availabilty_flag = 'LOW_STOCK';
      else product.stock_availabilty_flag = 'IN_STOCK';
      product.is_in_stock = stock > 0;
    }
    if (brand !== undefined) product.brand = brand;
    if (is_in_stock !== undefined) product.is_in_stock = is_in_stock;
    if (is_it_featured !== undefined) product.is_it_featured = is_it_featured;
    if (is_active !== undefined) product.is_active = is_active;
    if (highlights !== undefined) product.highlights = highlights;
    if (specifications !== undefined) product.specifications = specifications;
    if (faqs !== undefined) product.faqs = faqs;

    // Recalculate discount percentage if prices updated
    if (discount_percentage !== undefined) {
      product.discount_percentage = discount_percentage;
    } else if (product.original_price > 0 && product.current_price < product.original_price) {
      product.discount_percentage = Math.round(
        ((product.original_price - product.current_price) / product.original_price) * 100
      );
    }

    // Process optional new file uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    if (files) {
      if (Array.isArray(files)) {
        for (const file of files) {
          const upload_res = await upload_to_cloudinary(file.buffer, `products/${product.slug}/${file.originalname}`);
          product.media.push(upload_res);
        }
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
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
