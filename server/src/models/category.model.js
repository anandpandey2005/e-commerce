import mongoose, { Schema } from "mongoose";
import { getCloudinaryClient } from "../config/cloudinary/cloudinary.config.js";

const cloudinary = getCloudinaryClient();

const normalizeCategoryId = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const CategorySchema = new Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    image_public_id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Category name is required"],
    },
  },
  { timestamps: true, _id: false },
);

CategorySchema.pre("save", function (next) {
  if (this.isNew && this.name) {
    this._id = normalizeCategoryId(this.name);
  }
  next();
});

CategorySchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery()).lean();

  if (doc?.image_public_id) {
    try {
      await cloudinary.uploader.destroy(doc.image_public_id, {
        resource_type: "image",
        type: "upload",
        invalidate: true,
      });
      console.log("Cloud category image deleted successfully");
    } catch (error) {
      console.error("Cloud category image deletion failed:", error);
    }
  }

  next();
});

export const Category = mongoose.model("Category", CategorySchema);
