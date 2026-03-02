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
      enum: [
        "pending",
        "ordered",
        "cancelled",
        "refunded",
        "shipped",
        "in transist",
        "out for delivery",
        "delivered",
      ],
      default: "pending",
    },
    paymentMethod: { type: String },
    shippingAddress: { type: String, required: true },
    trackingId: { type: String, trim: true, default: null },
    trackingLink: { type: String, trim: true, default: null },
    razorpay: {
      transactionId: {
        type: String,
        default: null,
      },
      orderId: {
        type: String,
        default: null,
      },
    },
    note: {
      type: String,
      default:
        "We have received your order request. Our team is currently verifying the payment details with the bank. Your order status will be updated as soon as the confirmation is received.",
    },
  },
  { timestamps: true },
);

export const Order = mongoose.model("Order", OrderSchema);
