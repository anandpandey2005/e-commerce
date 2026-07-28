import { Types } from 'mongoose';

export interface IOwner {
  _id: Types.ObjectId;
  full_name: string;
  phone: {
    country_code: string;
    number: string;
  };
  email: string;
  otp: string;
  otp_expiry: string;
  role: {
    type: String;
    enum: ['owner'];
    default: 'owner';
  };
  createdAt: Date;
  updatedAt: Date;
}
