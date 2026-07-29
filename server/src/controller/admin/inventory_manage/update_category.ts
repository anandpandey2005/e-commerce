import { Request, Response } from 'express';
import { Admin_Category } from '../../../models/category.js';
import { update_category_schema } from '../../../validations/catalog.js';
import { generate_slug } from './add_category.js';
import { upload_to_cloudinary } from '../../../utils/upload_on_cloudinary.js';

export async function update_category(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = update_category_schema.safeParse(req.body);
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { _id, name, description, is_active } = parse_result.data;

    const category = await Admin_Category.findById(_id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
      return;
    }

    if (name !== undefined) {
      category.name = name;
      category.slug = generate_slug(name);
    }
    if (description !== undefined) {
      category.description = description;
    }
    if (is_active !== undefined) {
      category.is_active = is_active;
    }

    // Process new uploaded images if attached
    const files = req.files as Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
    if (files) {
      let file_array: Express.Multer.File[] = [];
      if (Array.isArray(files)) {
        file_array = files;
      } else if (typeof files === 'object') {
        Object.values(files).forEach((arr) => {
          file_array.push(...arr);
        });
      }

      for (const file of file_array) {
        const upload_result = await upload_to_cloudinary(
          file.buffer,
          `categories/${category.slug}/${file.originalname}`
        );
        category.media.push(upload_result);
      }
    } else if (req.file) {
      const upload_result = await upload_to_cloudinary(
        req.file.buffer,
        `categories/${category.slug}/${req.file.originalname}`
      );
      category.media.push(upload_result);
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully.',
      data: { category },
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
