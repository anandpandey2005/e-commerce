import mongoose, { Schema } from "mongoose";

const normalizeProductId = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const SpecificationGroupSchema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    details: { type: [SpecificationSchema], default: [] },
  },
  { _id: false },
);

const MediaAssetSchema = new Schema(
  {
    assetType: {
      type: String,
      enum: ["image", "gallery", "brousher"],
      required: true,
    },
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      required: true,
    },
    originalName: { type: String, trim: true, default: null },
    mimeType: { type: String, trim: true, default: null },
    bytes: { type: Number, min: 0, default: null },
    deliveryUrl: { type: String, trim: true, default: null },
    adaptiveUrl: { type: String, trim: true, default: null },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    _id: { type: String, lowercase: true, trim: true },
    name: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Product name is required"],
    },
    model: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "Product model is required"],
    },
    sku: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    brand: { type: String, lowercase: true, trim: true, default: null },
    category: [{ type: String, ref: "Category" }],
    oldPrice: {
      type: Number,
      required: true,
      min: [0, "oldPrice cannot be negative"],
    },
    newPrice: {
      type: Number,
      required: true,
      min: [0, "newPrice cannot be negative"],
    },
    stock: { type: Number, default: 0, min: [0, "stock cannot be negative"] },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, lowercase: true, trim: true }],
    description: { type: String, trim: true, default: null },
    specifications: { type: [SpecificationGroupSchema], default: [] },
    sold: { type: Number, default: 0, min: [0, "sold cannot be negative"] },
    image: [{ type: String, trim: true }],
    brousher: { type: String, trim: true, default: null },
    gallery: [{ type: String, trim: true }],
    mediaAssets: { type: [MediaAssetSchema], default: [] },
  },
  {
    timestamps: true,
    _id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.index({
  name: "text",
  model: "text",
  description: "text",
  tags: "text",
});
ProductSchema.index({ status: 1, createdAt: -1 });
ProductSchema.index({ newPrice: 1 });

ProductSchema.virtual("discountPercent").get(function () {
  if (!Number.isFinite(this.oldPrice) || this.oldPrice <= 0) {
    return 0;
  }

  const discount = ((this.oldPrice - this.newPrice) / this.oldPrice) * 100;
  return Math.max(0, Math.round(discount * 100) / 100);
});

ProductSchema.pre("validate", function (next) {
  if (
    Number.isFinite(this.oldPrice) &&
    Number.isFinite(this.newPrice) &&
    this.newPrice > this.oldPrice
  ) {
    this.invalidate("newPrice", "newPrice cannot be greater than oldPrice");
  }
  next();
});

ProductSchema.pre("save", function (next) {
  const normalizedProductId = normalizeProductId(this.name);

  if (this.isNew && normalizedProductId) {
    this._id = normalizedProductId;
  }

  if (Array.isArray(this.tags)) {
    this.tags = [
      ...new Set(
        this.tags
          .map((tag) =>
            String(tag || "")
              .toLowerCase()
              .trim(),
          )
          .filter(Boolean),
      ),
    ];
  }

  next();
});

export const Product = mongoose.model("Product", ProductSchema);
