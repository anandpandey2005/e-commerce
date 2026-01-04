import mongoose, { Schema } from "mongoose";

const CuponSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 1296000 * 1000,
    },
  },
  { timestamps: true }
);

export const Cupon = mongoose.model("Cupon", CuponSchema);
