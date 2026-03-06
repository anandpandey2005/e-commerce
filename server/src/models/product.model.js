import mongoose, { Schema } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { Category } from "./category.model";

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
    },
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Model is required"],
    },
    model: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Model is required"],
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    description: { type: String, lowercase: true, trim: true },
    specifications: [
      {
        category: { type: String, required: true },
        details: [SpecificationSchema],
      },
    ],
    sold: { type: Number, default: null },
    brousher: { type: String, trim: true, default: null },
    gallery: [{ type: String, trim: true, default: null }],
  },
  { timestamps: true, _id: false },
);

ProductSchema.pre("save", function (next) {
  if (this.isNew && this.name) {
    this._id = this.name
      .toLowerCase()
      .trim()
      .replace(/[\s.@]+/g, "-");
  }
  next();
});

ProductSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getQuery());

    if (doc) {
      const allUrls = [
        ...(doc.image || []),
        ...(doc.gallery || []),
        doc.brousher,
      ].filter((url) => typeof url === "string" && url.includes("cloud"));

      const deletePromises = allUrls.map((url) => {
        const parts = url.split("/");
        const uploadIndex = parts.findIndex((part) => part === "upload");

        const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
        const publicId = publicIdWithExt.split(".")[0];

        return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises);
      console.log(
        `Successfully cleared ${deletePromises.length} Cloud assets.`,
      );
    }
  } catch (error) {
    console.error("Cloud cleanup failed:", error);
  }
  next();
});

export const Product = mongoose.model("Product", ProductSchema);
