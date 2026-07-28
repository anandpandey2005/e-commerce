import mongoose, { Schema } from 'mongoose';
import {
  IProduct,
  IProductHighlight,
  IProductSpecification,
  IProductFAQ,
} from './types/catalog.js';

const ProductHighlightSchema = new Schema<IProductHighlight>(
  {
    title: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

const ProductSpecificationSchema = new Schema<IProductSpecification>(
  {
    category_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    specs: [
      {
        key: { type: String, required: true, lowercase: true, trim: true },
        value: { type: String, required: true, lowercase: true, trim: true },
      },
    ],
  },
  { _id: false }
);

const ProductFAQSchema = new Schema<IProductFAQ>(
  {
    question: { type: String, required: true, lowercase: true, trim: true },
    answer: { type: String, required: true, lowercase: true, trim: true },
    asked_by: { type: String, lowercase: true, trim: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true, lowercase: true, trim: true },
    original_price: { type: Number, required: true, min: 0 },
    current_price: { type: Number, required: true, min: 0 },
    discount_percentage: { type: Number, min: 0, max: 100, default: 0 },
    sku: { type: String, required: true, unique: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    is_in_stock: { type: Boolean, default: true },
    is_it_featured: { type: Boolean, default: false },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    brand: { type: String, required: true, lowercase: true, trim: true },
    media: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
        resource_type: { type: String },
      },
    ],
    thumbnail: { type: String, required: true, trim: true },
    highlights: { type: [ProductHighlightSchema], default: [] },
    specifications: { type: [ProductSpecificationSchema], default: [] },
    faqs: { type: [ProductFAQSchema], default: [] },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    stock_availabilty_flag: {
      type: String,
      enum: ['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'],
      default: 'IN_STOCK',
      required: true,
    },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
