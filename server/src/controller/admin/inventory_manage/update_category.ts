import { Request, Response } from 'express';
import { Admin_Category } from '../../../models/category.js';
import { update_category_schema } from '../../../validations/catalog.js';
import { generate_slug } from './add_category.js';
import {
  extract_multer_files,
  upload_multiple_to_cloudinary,
} from '../../../utils/upload_on_cloudinary.js';

export async function update_category(req: Request, res: Response): Promise<void> {
  try {
    const body_data = { ...req.body };
    if (typeof body_data.is_active === 'string') body_data.is_active = body_data.is_active === 'true';

    const parse_result = update_category_schema.safeParse(body_data);
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

    // Process new uploaded file arrays concurrently
    const { all_files } = extract_multer_files(req);
    if (all_files.length > 0) {
      const new_media = await upload_multiple_to_cloudinary(
        all_files,
        `admin/categories/${category.slug}/media`
      );

      category.media.push(...new_media);
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
