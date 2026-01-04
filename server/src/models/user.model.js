import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    line1: { type: String, required: true, trim: true },
    line2: { type: String, trim: true },
    line3: { type: String, trim: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
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
    email: {
      type: String,
      required: [true, "Email required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    address: [addressSchema],

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
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const User = mongoose.model("User", UserSchema);
