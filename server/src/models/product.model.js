import mongoose, { Schema } from "mongoose";

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    image: [{ type: String, trim: true, default: null }],
    _id: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Product name is required"],
    },
    model: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Model is required"],
    },

    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },

    description: { type: String, lowercase: true, trim: true },

    specifications: [
      {
        category: { type: String, required: true },
        details: [SpecificationSchema],
      },
    ],
    selled: {
      type: Number,
      default: null,
    },
    brousher: {
      type: String,
      trim: true,
      default: null,
    },
    gallery: [
      {
        type: String,
        trim: true,
        default: null,
      },
    ],
  },
  { timestamps: true, _id: false },
);

export const Product = mongoose.model("Product", ProductSchema);
