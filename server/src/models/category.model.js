import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { Product } from "./product.model.js";

const Category_Schema = new Schema(
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
      set: function (value) {
        return value
          .replace(/\s+/g, " ")
          .replace(/[^\w\s]/gi, "")
          .trim();
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

Category_Schema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
  next();
});

Category_Schema.pre(
  ["updateOne", "updateMany", "findOneAndUpdate"],
  async function (next) {
    const update = this.getUpdate();

    if (
      update.active === false ||
      (update.$set && update.$set.active === false)
    ) {
      const filter = this.getQuery();

      const categories = await this.model.find(filter).select("_id");
      const categoryIds = categories.map((cat) => cat._id);

      if (categoryIds.length > 0) {
        await mongoose
          .model("Product")
          .updateMany(
            { category: { $in: categoryIds } },
            { $set: { active: false } },
          );

        console.log(
          `Deactivated products for ${categoryIds.length} categories.`,
        );
      }
    }
    next();
  },
);

export const Category = mongoose.model("Category", Category_Schema);
