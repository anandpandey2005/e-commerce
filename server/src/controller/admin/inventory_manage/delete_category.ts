import { Request, Response } from 'express';
import { Admin_Category } from '../../../models/category.js';
import { delete_record_schema } from '../../../validations/catalog.js';

export async function delete_category(req: Request, res: Response): Promise<void> {
  try {
    const parse_result = delete_record_schema.safeParse(req.body);

    if (!parse_result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: parse_result.error.flatten().fieldErrors,
      });
      return;
    }

    const id = parse_result.data._id;


        const result = await Admin_Category.findByIdAndDelete(id);

        if (!result) {
            res.status(404).json({
                success: false,
                message: "Category not found.",
                data: null
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
            data: null,
        });
        return;

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error instanceof Error ? error.message : "An unexpected system error occured.",
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "An unexpected system error occured.",
        });
        return;
    }
}