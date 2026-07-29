import { Request, Response } from 'express';
import { Admin_Category } from '../../../models/category.js';
import { add_category_schema } from '../../../validations/catalog.js';
import {
  extract_multer_files,
  upload_multiple_to_cloudinary,
} from '../../../utils/upload_on_cloudinary.js';

export function generate_slug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function add_category(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = add_category_schema.safeParse(req.body || {});
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

    const { name, description } = parse_result.data;
    const slug = generate_slug(name);

    const existing_category = await Admin_Category.findOne({ slug });
    if (existing_category) {
      res.status(400).json({
        success: false,
        message: `Category with name/slug '${slug}' already exists.`,
      });
      return;
    }

    const { all_files } = extract_multer_files(req);
    if (!all_files.length) {
      res.status(400).json({
        success: false,
        message: 'No files uploaded.',
      });
      return;
    }

    const media = await upload_multiple_to_cloudinary(all_files, `${process.env.STORE_NAME}/admin/categories/${slug}/media`);


    const category = new Admin_Category({
      name,
      slug,
      description,
      media,
      is_active: true,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully.',
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
