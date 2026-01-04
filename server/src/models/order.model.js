import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema({}, { timestamps: true });

export const Order = mongoose.model("Order", OrderSchema);
