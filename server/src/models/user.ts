import mongoose, { Schema } from 'mongoose';
import { IUser, IAddress, IUserSettings } from './types/user.js';

const AddressSchema = new Schema<IAddress>({
  tag: { type: String, lowercase: true, trim: true, required: true },
  line_1: { type: String, lowercase: true, trim: true, required: true },
  line_2: { type: String, lowercase: true, trim: true },
  landmark: { type: String, lowercase: true, trim: true },
  state: { type: String, lowercase: true, trim: true, required: true },
  pincode: { type: String, trim: true, required: true },
  country: { type: String, lowercase: true, trim: true, required: true },
  is_default: { type: Boolean, default: false },
});

const SettingsSchema = new Schema<IUserSettings>(
  {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    avatar: {
      public_id: { type: String, trim: true, default: '' },
      secure_url: { type: String, trim: true, default: '' },
      resource_type: { type: String, trim: true, default: '' },
    },
    full_name: { type: String, required: true, lowercase: true, trim: true },
    phone: {
      country_code: { type: String, required: true, default: '+91' },
      number: { type: String, lowercase: true, trim: true, required: true },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, trim: true, required: true },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    saved_items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    saved_address: { type: [AddressSchema], default: [] },
    settings: {
      type: SettingsSchema,
      default: () => ({
        theme: 'system',
        currency: 'INR',
        language: 'en',
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      }),
    },
    refresh_token: { type: String, trim: true },
    otp: { type: String, trim: true },
    otp_expiry: { type: Date },
    pending_email: { type: String, lowercase: true, trim: true },
    pending_phone: {
      country_code: { type: String, trim: true },
      number: { type: String, lowercase: true, trim: true },
    },
    email_otp: { type: String, trim: true },
    email_otp_expiry: { type: Date },
    phone_otp: { type: String, trim: true },
    phone_otp_expiry: { type: Date },
    archived: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    role: {
      type: String,
      enum: ['user'],
      default: 'user',
    },
    is_email_verified: { type: Boolean, default: false },
    is_phone_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } }
);
UserSchema.index(
  { 'phone.number': 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } }
);

export const User = mongoose.model<IUser>('User', UserSchema);
