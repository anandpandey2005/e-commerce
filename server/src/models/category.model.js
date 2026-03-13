import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

const CategorySchema = new Schema(
  {
    image: {
      secure_url: {
        type: String,
        default: null,
      },
      public_id: {
        type: String,
        default: null,
      },
    },
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Category name is required"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

export const Category = mongoose.model("Category", CategorySchema);
