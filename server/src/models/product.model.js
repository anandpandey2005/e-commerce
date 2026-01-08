import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);
