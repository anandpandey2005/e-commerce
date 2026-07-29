import { Schema } from 'mongoose';
import { IOrder, IOrderItem, IAddress } from './types/user.js';
import { admin_db, user_db } from '../config/db.js';

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const AddressSchema = new Schema<IAddress>(
  {
    tag: { type: String, lowercase: true, trim: true, required: true },
    line_1: { type: String, lowercase: true, trim: true, required: true },
    line_2: { type: String, lowercase: true, trim: true },
    landmark: { type: String, lowercase: true, trim: true },
    state: { type: String, lowercase: true, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
    country: { type: String, lowercase: true, trim: true, required: true },
    is_default: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, min: 0, default: 0 },
    shipping_fee: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total_amount: { type: Number, required: true, min: 0 },
    shipping_address: { type: AddressSchema, required: true },
    payment_info: {
      method: {
        type: String,
        enum: ['razorpay'],
        default: 'razorpay',
        required: true,
      },
      status: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED'],
        default: 'PENDING',
        required: true,
      },
      razorpay_order_id: { type: String, trim: true },
      razorpay_payment_id: { type: String, trim: true },
      razorpay_signature: { type: String, trim: true },
    },
    order_status: {
      type: String,
      enum: [
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
        'REFUNDED',
      ],
      default: 'PENDING',
      required: true,
    },
    tracking_id: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

export const Admin_Order = admin_db.model<IOrder>('Order', OrderSchema);
export const User_Order = user_db.model<IOrder>('Order', OrderSchema);
export const Order = User_Order;
