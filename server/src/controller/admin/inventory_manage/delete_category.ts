import { Request, Response } from "express";
import { Types } from "mongoose";
import z from "zod";
import { Category } from "../../../models/category.js";

const validate_data = z.object({
    _id: z.string().refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId format",
    }),
});

export async function delete_category(req: Request, res: Response): Promise<void> {
    try {
        const validated_data = validate_data.safeParse(req.body);

        if (!validated_data.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed.",
                errors: validated_data.error.issues,
            });
            return;
        }

        const id = validated_data.data._id;

        const result = await Category.findByIdAndDelete(id);

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