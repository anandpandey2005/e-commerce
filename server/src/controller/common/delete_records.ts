import { Request, Response } from 'express';
import { Model, Types } from 'mongoose';
import z from 'zod';
import { Admin_Product } from '../../models/product.js';
import { Admin_Category } from '../../models/category.js';
import { Admin_User } from '../../models/user.js';
import { Admin_Story } from '../../models/story.js';

const MODEL_REGISTRY: Record<string, { model: Model<any>; supports_soft_delete: boolean }> = {
  product: { model: Admin_Product, supports_soft_delete: false },
  category: { model: Admin_Category, supports_soft_delete: false },
  user: { model: Admin_User, supports_soft_delete: true },
  story: { model: Admin_Story, supports_soft_delete: false },
};

const id_schema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format.',
});

const delete_records_schema = z.object({
  identifier: z.string().trim().toLowerCase(),
  id: id_schema.optional(),
  ids: z.array(id_schema).min(1, 'ids array cannot be empty.').optional(),
  mode: z.enum(['soft', 'hard']).optional().default('hard'),
}).refine((data) => data.id || (data.ids && data.ids.length > 0), {
  message: 'Either a single "id" or an array of "ids" must be provided.',
  path: ['id'],
});

export async function delete_records(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = delete_records_schema.safeParse(req.body);

    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, id, ids, mode } = parse_result.data;

    const registry_entry = MODEL_REGISTRY[identifier];
    if (!registry_entry) {
      res.status(400).json({
        success: false,
        message: `Invalid model identifier '${identifier}'. Supported identifiers: ${Object.keys(MODEL_REGISTRY).join(', ')}`,
      });
      return;
    }

    const { model, supports_soft_delete } = registry_entry;
    const target_ids = ids ? ids : [id!];

    // Soft delete execution
    if (mode === 'soft' && supports_soft_delete) {
      const result = await model.updateMany(
        { _id: { $in: target_ids } },
        { $set: { is_deleted: true, deleted_at: new Date() } }
      );

      res.status(200).json({
        success: true,
        message: `Soft delete executed successfully for '${identifier}'.`,
        data: {
          matched_count: result.matchedCount,
          modified_count: result.modifiedCount,
        },
      });
      return;
    }

    // Hard delete execution
    const delete_result = await model.deleteMany({ _id: { $in: target_ids } });

    if (delete_result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: `No records found to delete in '${identifier}'.`,
        data: null,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: `${delete_result.deletedCount} record(s) deleted successfully from '${identifier}'.`,
      data: {
        deleted_count: delete_result.deletedCount,
      },
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
