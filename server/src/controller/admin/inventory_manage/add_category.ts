import { Request, Response } from 'express';
import { Admin_Category } from '../../../models/category.js';
import { add_category_schema } from '../../../validations/catalog.js';
import { upload_to_cloudinary } from '../../../utils/upload_on_cloudinary.js';

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
    const parse_result = add_category_schema.safeParse(req.body);
    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
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

    const media: { public_id: string; secure_url: string; resource_type: string }[] = [];

    // Handle single or multiple file uploads if present via multer
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
          `categories/${slug}/${file.originalname}`
        );
        media.push(upload_result);
      }
    } else if (req.file) {
      const upload_result = await upload_to_cloudinary(
        req.file.buffer,
        `categories/${slug}/${req.file.originalname}`
      );
      media.push(upload_result);
    }

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
