import mongoose, { Schema } from "mongoose";

const Address_Schema = new Schema({
  line_1: {
    type: String,
    required: true,
    trim: true,
  },
  line_2: {
    type: String,
    default: null,
    trim: true,
  },
  landmark: { type: String, default: null, trim: true },
  state: { type: String, required: true },
  post_office: {
    type: String,
    required: true,
    trim: true,
  },
  pin_code: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, "Please fill a valid 6-digit pincode"],
  },
  country: { type: String, default: null },
  address_type: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
});

const User_Schema = new Schema(
  {
    gmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      first: {
        type: String,
        required: [true, "First name required"],
        trim: true,
      },
      middle: { type: String, default: null, trim: true },
      last: {
        type: String,
        required: [true, "Last name required"],
        trim: true,
      },
    },
    phone: {
      number: {
        type: String,
        required: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"],
      },
      country_code: {
        type: String,
        default: "+91",
      },
      is_verified: {
        type: Boolean,
        default: false,
      },
    },

    address: [{ Address_Schema }],

    cupon: [{ type: Schema.Types.ObjectId, ref: "Cupon" }],
    order: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],

    notification: [{ type: Schema.Types.ObjectId, ref: "Notification" }],

    role: {
      type: String,
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
    },
    expiry_otp: {
      type: Date,
      default: null,
    },
    is_logged_in: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", User_Schema);
