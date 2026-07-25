import { Types } from 'mongoose';

export interface IAddress {
  _id?: Types.ObjectId;
  tag: string;
  line_1: string;
  line_2?: string;
  landmark?: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export type OrderStatus =
  'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface IOrderItem {
  product_id: Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  shipping_address: IAddress;
  payment_info: {
    method: 'razorpay';
    status: PaymentStatus;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  order_status: OrderStatus;
  tracking_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSettings {
  theme?: 'light' | 'dark' | 'system';
  currency?: string;
  language?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface IUser {
  _id: Types.ObjectId;
  avatar: string;
  full_name: string;
  phone: {
    country_code: string;
    number: string;
  };
  email: string;
  password: string;
  orders: Types.ObjectId[];
  saved_items?: Types.ObjectId[];
  saved_address: IAddress[];
  settings: IUserSettings;
  refresh_token?: string;
  otp?: string;
  otp_expiry?: Date;
  archived: boolean;
  role: 'user' | 'owner' | 'support' | 'employee';
  is_email_verified: boolean;
  is_phone_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
