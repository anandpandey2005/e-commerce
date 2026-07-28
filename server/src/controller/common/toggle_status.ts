import { Request, Response } from 'express';
import { Model, Types } from 'mongoose';
import z from 'zod';
import { Product } from '../../models/product.js';
import { Category } from '../../models/category.js';
import { User } from '../../models/user.js';
import { Story } from '../../models/story.js';

// Safe registry of allowed models and their toggleable boolean fields
const MODEL_REGISTRY: Record<string, { model: Model<any>; allowed_fields: string[]; default_field: string }> = {
  product: {
    model: Product,
    allowed_fields: ['is_active', 'is_in_stock', 'is_it_featured'],
    default_field: 'is_active',
  },
  category: {
    model: Category,
    allowed_fields: ['is_active'],
    default_field: 'is_active',
  },
  user: {
    model: User,
    allowed_fields: ['archived', 'is_deleted', 'is_email_verified', 'is_phone_verified'],
    default_field: 'archived',
  },
  story: {
    model: Story,
    allowed_fields: ['is_active'],
    default_field: 'is_active',
  },
};

const id_schema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId format.',
});

const toggle_status_schema = z.object({
  identifier: z.string().trim().toLowerCase(),
  id: id_schema.optional(),
  ids: z.array(id_schema).min(1, 'ids array cannot be empty.').optional(),
  field: z.string().trim().optional(),
  target_value: z.boolean().optional(),
}).refine((data) => data.id || (data.ids && data.ids.length > 0), {
  message: 'Either a single "id" or an array of "ids" must be provided.',
  path: ['id'],
});

export async function toggle_status(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = toggle_status_schema.safeParse(req.body);

    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const { identifier, id, ids, field, target_value } = parse_result.data;

    const registry_entry = MODEL_REGISTRY[identifier];
    if (!registry_entry) {
      res.status(400).json({
        success: false,
        message: `Invalid model identifier '${identifier}'. Supported identifiers: ${Object.keys(MODEL_REGISTRY).join(', ')}`,
      });
      return;
    }

    const { model, allowed_fields, default_field } = registry_entry;
    const target_field = field || default_field;

    if (!allowed_fields.includes(target_field)) {
      res.status(400).json({
        success: false,
        message: `Field '${target_field}' is not allowed for toggling on '${identifier}'. Allowed fields: ${allowed_fields.join(', ')}`,
      });
      return;
    }

    const target_ids = ids ? ids : [id!];

    // Single record update vs bulk record update
    if (target_ids.length === 1) {
      const target_id = target_ids[0];
      const document = await model.findById(target_id);

      if (!document) {
        res.status(404).json({
          success: false,
          message: `Record with id '${target_id}' not found in '${identifier}'.`,
          data: null,
        });
        return;
      }

      const new_value = target_value !== undefined ? target_value : !document[target_field];
      document[target_field] = new_value;
      await document.save();

      res.status(200).json({
        success: true,
        message: `Status field '${target_field}' for '${identifier}' updated successfully.`,
        data: {
          id: target_id,
          field: target_field,
          updated_value: new_value,
        },
      });
      return;
    }

    // Bulk update handling
    if (target_value !== undefined) {
      const update_result = await model.updateMany(
        { _id: { $in: target_ids } },
        { $set: { [target_field]: target_value } }
      );

      res.status(200).json({
        success: true,
        message: `Bulk status update completed for '${identifier}'.`,
        data: {
          field: target_field,
          updated_value: target_value,
          matched_count: update_result.matchedCount,
          modified_count: update_result.modifiedCount,
        },
      });
      return;
    } else {
      // Toggle each item when no explicit target value is passed
      const documents = await model.find({ _id: { $in: target_ids } });
      const bulk_ops = documents.map((doc) => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { [target_field]: !doc[target_field] } },
        },
      }));

      if (bulk_ops.length > 0) {
        await model.bulkWrite(bulk_ops);
      }

      res.status(200).json({
        success: true,
        message: `Bulk status toggle completed for '${identifier}'.`,
        data: {
          field: target_field,
          processed_count: documents.length,
        },
      });
      return;
    }
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
