import mongoose, { Schema } from 'mongoose';
import { ICategory } from './types/catalog.js';


const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, lowercase: true, trim: true, default: '' },
    media: [{
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      resource_type: { type: String }
    }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
