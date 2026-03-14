import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { User } from "./user.model.js";
import { Category } from "./category.model.js";

const Review_Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true },
);

const Product_Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      set: function (value) {
        return value
          .replace(/\s+/g, " ")
          .replace(/[^\w\s]/gi, "")
          .trim();
      },
    },
    model: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      set: function (value) {
        return value
          .replace(/\s+/g, " ")
          .replace(/[^\w\s]/gi, "")
          .trim();
      },
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    specification: [
      {
        key: { type: String, trim: true, lowercase: true },
        value: { type: String, trim: true, lowercase: true },
      },
    ],
    catalog: {
      secure_url: { type: String, default: null, trim: true },
      public_id: { type: String, default: null, trim: true },
    },
    base_price: {
      type: Number,
      required: true,
      set: (v) => Math.round(v * 100) / 100,
    },
    discount_price: {
      type: Number,
      required: true,
      set: (v) => Math.round(v * 100) / 100,
    },
    discount_percentage: {
      type: Number,
      default: 0,
    },
    average_star: {
      type: Number,
      default: 0,
      set: (v) => Math.round(v * 100) / 100,
    },

    reviews: [Review_Schema],

    media_assets: [
      {
        resource_type: { type: String, required: true },
        secure_url: { type: String, required: true, trim: true },
        public_id: { type: String, required: true, trim: true },
        hls_url: { type: String, default: null },
      },
    ],
    on_sale: {
      type: Boolean,
      default: false,
    },
    sales_count: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    stock_status: {
      type: String,
      enum: ["good", "fair", "critical"],
      default: null,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true },
);

Product_Schema.pre(["save", "updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate ? this.getUpdate() : this;

  if (update.stock !== undefined) {
    if (update.stock <= 0) {
      update.active = false;
      console.log("Stock is 0. Product deactivated automatically.");
    }
  }
  next();
});

Product_Schema.pre(["save", "updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate ? this.getUpdate() : this;
  if (update.stock !== undefined) {
    if (update.stock <= 5) {
      update.stock_status = "critical";
    } else if (update.stock <= 20) {
      update.stock_status = "fair";
    } else {
      update.stock_status = "good";
    }
  }
  next();
});

Product_Schema.pre("save", function (next) {
  if (this.isModified("name") || this.isModified("model")) {
    this.slug = slugify(`${this.name}-${this.model}`, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  if (this.isModified("base_price") || this.isModified("discount_price")) {
    if (this.base_price > 0) {
      const percentage =
        ((this.base_price - this.discount_price) / this.base_price) * 100;
      this.discount_percentage = Math.max(0, Math.round(percentage));
    }
  }

  if (this.isModified("reviews")) {
    if (this.reviews && this.reviews.length > 0) {
      const totalStars = this.reviews.reduce((acc, item) => acc + item.star, 0);
      this.average_star = totalStars / this.reviews.length;
    } else {
      this.average_star = 0;
    }
  }

  next();
});

export const Product = mongoose.model("Product", Product_Schema);
