import { z } from 'zod';
import { Types } from 'mongoose';

export const mongo_id_schema = z
  .string()
  .trim()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format.',
  });

export const add_category_schema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters.'),
  description: z.string().trim().optional().default(''),
});

export const update_category_schema = z.object({
  _id: mongo_id_schema,
  name: z.string().trim().min(2, 'Category name must be at least 2 characters.').optional(),
  description: z.string().trim().optional(),
  is_active: z.boolean().optional(),
});

export const product_highlight_schema = z.object({
  title: z.string().trim().min(1, 'Highlight title is required.'),
  description: z.string().trim().min(1, 'Highlight description is required.'),
});

export const product_spec_schema = z.object({
  category_name: z.string().trim().min(1, 'Spec category name is required.'),
  specs: z.array(
    z.object({
      key: z.string().trim().min(1, 'Spec key is required.'),
      value: z.string().trim().min(1, 'Spec value is required.'),
    })
  ),
});

export const product_faq_schema = z.object({
  question: z.string().trim().min(1, 'Question is required.'),
  answer: z.string().trim().min(1, 'Answer is required.'),
  asked_by: z.string().trim().optional(),
});

export const add_product_schema = z.object({
  name: z.string().trim().min(2, 'Product name must be at least 2 characters.'),
  description: z.string().trim().min(5, 'Description must be at least 5 characters.'),
  original_price: z.number().min(0, 'Original price cannot be negative.'),
  current_price: z.number().min(0, 'Current price cannot be negative.'),
  discount_percentage: z.number().min(0).max(100).optional(),
  sku: z.string().trim().min(1, 'SKU is required.'),
  stock: z.number().min(0, 'Stock cannot be negative.'),
  category_id: mongo_id_schema,
  brand: z.string().trim().min(1, 'Brand name is required.'),
  is_in_stock: z.boolean().optional(),
  is_it_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  highlights: z.array(product_highlight_schema).optional().default([]),
  specifications: z.array(product_spec_schema).optional().default([]),
  faqs: z.array(product_faq_schema).optional().default([]),
});

export const update_product_schema = z.object({
  _id: mongo_id_schema,
  name: z.string().trim().min(2).optional(),
  description: z.string().trim().min(5).optional(),
  original_price: z.number().min(0).optional(),
  current_price: z.number().min(0).optional(),
  discount_percentage: z.number().min(0).max(100).optional(),
  sku: z.string().trim().min(1).optional(),
  stock: z.number().min(0).optional(),
  category_id: mongo_id_schema.optional(),
  brand: z.string().trim().min(1).optional(),
  is_in_stock: z.boolean().optional(),
  is_it_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
  highlights: z.array(product_highlight_schema).optional(),
  specifications: z.array(product_spec_schema).optional(),
  faqs: z.array(product_faq_schema).optional(),
});

export const export_inventory_schema = z.object({
  format: z.enum(['json', 'csv', 'excel']).optional().default('json'),
});
