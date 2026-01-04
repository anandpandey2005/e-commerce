import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["ORDER_UPDATE", "PROMOTIONAL", "SYSTEM_ALERT"],
      default: "SYSTEM_ALERT",
    },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    expiresAt: {
      type: Date,
      default: () => Date.now() + 1296000 * 1000,
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", NotificationSchema);
