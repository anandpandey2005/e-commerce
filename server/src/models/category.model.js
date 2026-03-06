import mongoose, { Schema } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
const CategorySchema = new Schema(
  {
    _id: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Product name is required"],
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
      required: [true, "category name required"],
    },
  },
  { timestamps: true, _id: false },
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this._id = this.name.toLowerCase().split(" ").join("-");
  }
  next();
});

CategorySchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc && doc.image && doc.image.public_id) {
    try {
      await cloudinary.uploader.destroy(doc.image.public_id);
      console.log("Cloud image deleted successfully");
    } catch (error) {
      console.error("Cloud image deletion failed:", error);
    }
  }
  next();
});

export const Category = mongoose.model("Category", CategorySchema);
