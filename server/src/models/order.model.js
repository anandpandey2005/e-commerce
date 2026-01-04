import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true }, 
      },
    ],
    appliedCupon: { type: Schema.Types.ObjectId, ref: "Cupon" },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed","refund"],
      default: "pending",
    },
    paymentMethod: { type: String }, 
    shippingAddress: { type: String, required: true },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", OrderSchema);
