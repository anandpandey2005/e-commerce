import { Schema } from 'mongoose';
import { ICategory } from './types/catalog.js';
import { admin_db, user_db } from '../config/db.js';

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
    media: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true },
        resource_type: { type: String },
      },
    ],
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Admin_Category = admin_db.model<ICategory>('Category', CategorySchema);
export const User_Category = user_db.model<ICategory>('Category', CategorySchema);
export const Category = Admin_Category;
