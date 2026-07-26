import { Types } from 'mongoose';
import { ICloudinaryImage } from './catalog.js';
export interface IStory {
  _id: Types.ObjectId;
  title: string;
  description: string;
  media: ICloudinaryImage;
  link?: string;
  external_link?: string;
  createdAt: Date;
  updatedAt: Date;
}
