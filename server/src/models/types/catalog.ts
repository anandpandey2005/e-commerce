import { Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId;
  images: string[];
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
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
  images: string[];
  thumbnail: string;
  highlights: IProductHighlight[];
  specifications: IProductSpecification[];
  faqs: IProductFAQ[];
  ratings: {
    average: number;
    count: number;
  };
  stock_availabilty_flag: string;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}
