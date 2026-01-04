import mongoose, { Schema } from "mongoose";

const CartSchema = new Schema({}, { timestamps: true });

export const Cart = mongoose.model("Cart", CartSchema);
