import { Types } from 'mongoose';

export interface ICloudinaryImage {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

export interface ICategory {
  _id: Types.ObjectId;
  media: ICloudinaryImage[];
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductHighlight {
  title: string;
  description: string;
}

export interface IProductSpecification {
  category_name: string;
  specs: {
    key: string;
    value: string;
  }[];
}

export interface IProductFAQ {
  question: string;
  answer: string;
  asked_by?: string;
}

export interface IProduct {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  original_price: number;
  current_price: number;
  discount_percentage?: number;
  sku: string;
  stock: number;
  is_in_stock: boolean;
  is_it_featured: boolean;
  category_id: Types.ObjectId;
  brand: string;
  media: ICloudinaryImage[];
  thumbnail: string;
  highlights: IProductHighlight[];
  specifications: IProductSpecification[];
  faqs: IProductFAQ[];
  ratings: {
    average: number;
    count: number;
  };
  stock_availabilty_flag: string;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
