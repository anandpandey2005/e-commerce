import mongoose, { Schema } from "mongoose";

const CuponSchema = new Schema({}, { timestamps: true });

export const Cupon = mongoose.model("Cupon", CuponSchema);
