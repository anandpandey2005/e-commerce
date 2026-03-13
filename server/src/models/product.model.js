import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const Product_Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", Product_Schema);
