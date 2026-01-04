import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    line1: {
      type: String,
      trim: true,
      required: true,
    },
    line2: {
      type: String,
      trim: true,
      default: null,
    },
    pincode: {
      type: String,
      trim: true,
      required: [true, "pincode must be non-empty"],
    },
    cityDistrictTown: {
      type: String,
      trim: true,
      default: null,
    },
    landmark: {
      type: String,
      trim: true,
      default: null,
    },
    state: {
      type: String,
      trim: true,
      required: [true, "State name must be non-empty"],
    },
    alternatePhoneNumber: {
      type: String,
      trim: true,
      length: 10,
      default: null,
    },
  },
  { timestamps: true }
);

const UserSchema = new Schema(
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

    address: [addressSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
