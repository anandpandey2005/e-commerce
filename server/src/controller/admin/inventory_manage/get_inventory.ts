import { Request, Response } from 'express';
import { Admin_Product } from '../../../models/product.js';
import { Admin_Category } from '../../../models/category.js';

/**
 * Controller to fetch all categories with product count
 */
export async function get_categories(_req: Request, res: Response): Promise<void> {
  try {
    const categories = await Admin_Category.find().sort({ createdAt: -1 });
    
    // Compute product count per category
    const category_ids = categories.map((c) => c._id);
    const counts = await Admin_Product.aggregate([
      { $match: { category_id: { $in: category_ids } } },
      { $group: { _id: '$category_id', count: { $sum: 1 } } },
    ]);

    const count_map: Record<string, number> = {};
    counts.forEach((c: { _id: { toString(): string }; count: number }) => {
      count_map[c._id.toString()] = c.count;
    });

    const result = categories.map((cat) => ({
      ...cat.toObject(),
      productCount: count_map[cat._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully.',
      data: { categories: result },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve categories.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories.',
    });
  }
}

/**
 * Controller to fetch products with search, category filter, stock status, and pagination
 */
export async function get_products(req: Request, res: Response): Promise<void> {
  try {
    const { search, category_id, stock_flag, is_active, page = '1', limit = '20' } = req.query;

    const query: Record<string, any> = {};

    if (search && typeof search === 'string' && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { sku: regex }, { brand: regex }];
    }

    if (category_id && typeof category_id === 'string' && category_id !== 'all') {
      query.category_id = category_id;
    }

    if (stock_flag && typeof stock_flag === 'string') {
      query.stock_availabilty_flag = stock_flag;
    }

    if (is_active !== undefined) {
      query.is_active = is_active === 'true';
    }

    const page_num = Math.max(1, parseInt(page as string, 10) || 1);
    const limit_num = Math.max(1, Math.min(100, parseInt(limit as string, 10) || 20));
    const skip = (page_num - 1) * limit_num;

    const total = await Admin_Product.countDocuments(query);
    const products = await Admin_Product.find(query)
      .populate('category_id', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit_num);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully.',
      data: {
        products,
        pagination: {
          total,
          page: page_num,
          limit: limit_num,
          pages: Math.ceil(total / limit_num),
        },
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve products.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products.',
    });
  }
}

/**
 * Controller to fetch single product rich detail by ID
 */
export async function get_product_by_id(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const product = await Admin_Product.findById(id).populate('category_id', 'name slug description');

    if (!product) {
      res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Product details retrieved successfully.',
      data: { product },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve product details.',
      });
      return;
    }
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product details.',
    });
  }
}
