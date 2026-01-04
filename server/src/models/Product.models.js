import mongoose, { Schema } from "mongoose";
import { Category } from "./Categories.models.js";

const specificationSchema = new Schema(
  {
    key: {
      type: String,
      trim: true,
      required: true,
    },
    value: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

const reviewSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    userImage: {
      type: String,
      trim: true,
      default: "https://default-user-profile-image.png",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Review must be at least 5 characters."],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { timestamps: true }
);

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Product name must be non-empty"],
      unique: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot be more than 100 characters"],
    },

    model: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Product description is required."],
      minlength: [20, "Description must be at least 20 characters."],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category."],
    },

    image: {
      type: String,
      trim: true,
      required: true,
      default:
        "https://res.cloudinary.com/dxela17ca/image/upload/v1761718278/nocontent_pv8nwh.png",
    },

    mrp: {
      type: Number,
      min: [0, "MRP cannot be negative"],
    },
    sellingPrice: {
      type: Number,
      min: [0, "Selling price cannot be negative"],
      required: true,
    },

    specification: {
      type: [specificationSchema],
      default: [],
    },

    reviews: {
      type: [reviewSchema],
      default: [],
    },

    averageRating: {
      type: Number,
      default: null,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    numReviews: {
      type: Number,
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
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ProductSchema.methods.calculateAverageRating = function () {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );
    this.averageRating = totalRating / this.reviews.length;
    this.numReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.numReviews = 0;
  }
};

ProductSchema.index({ name: "text", description: "text", model: "text" });
ProductSchema.index({ category: 1, sellingPrice: 1 });

export const Product = mongoose.model("Product", ProductSchema);
