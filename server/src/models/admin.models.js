import mongoose, { Schema } from "mongoose";

const AdminSchema = new Schema(
  {
    avtar: {
      type: String,
    },
    name: {
      first: {
        type: String,
        trim: true,
        uppercase: true,
        required: [true, "First name must be non-empty"],
      },
      last: {
        type: String,
        trim: true,
        uppercase: true,
        default: null,
      },
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      length: 10,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please fill a valid email address",
      ],
    },
  },
  { timestamps: true }
);

export const Admin = mongoose.model("Admin", AdminSchema);
