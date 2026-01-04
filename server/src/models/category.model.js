import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({}, { timestamps: true });

export const Category = mongoose.model("Category",CategorySchema);
