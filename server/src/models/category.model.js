import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    image: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "category name required"],
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", CategorySchema);
