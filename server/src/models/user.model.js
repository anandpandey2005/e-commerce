import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  houseNumber: { type: String, required: true, trim: true },
  buildingName: { type: String, trim: true },
  streetAddress: { type: String, required: true, trim: true },
  landmark: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true },
  pinCode: {
    type: String,
    required: true,
    match: [/^[0-9]{6}$/, "Please fill a valid 6-digit pincode"],
  },
  country: { type: String, default: "India" },
  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
});

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true,
    },
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
      countryCode: {
        type: String,
        default: "+91",
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
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
      enum: ["user", "admin", "superAdmin"],
      default: "user",
    },
    otp: {},
    expiryOtp: {},
    isLoggedin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    _id: false,
  },
);

UserSchema.pre("save", function (next) {
  if (this.isNew && this.gmail) {
    this._id = this.gmail.toLowerCase().replace(/[@.]/g, "-");
  }
  next();
});
export const User = mongoose.model("User", UserSchema);
