import mongoose, { Schema } from "mongoose";

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    image: [{ type: String, trim: true, default: null }],
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Name is required"],
    },
    model: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Model is required"],
    },
    description: { type: String, lowercase: true, trim: true },

    specifications: [
      {
        category: { type: String, required: true },
        details: [SpecificationSchema],
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", ProductSchema);
