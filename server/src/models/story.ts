import { Schema } from 'mongoose';
import { IStory } from './types/story.js';
import { admin_db, user_db } from '../config/db.js';

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true, lowercase: true, trim: true },
    media: {
      public_id: { type: String, required: true },
      secure_url: { type: String, required: true },
      resource_type: { type: String },
    },
    link: { type: String, trim: true },
    external_link: { type: String, trim: true },
  },
  { timestamps: true }
);

export const Admin_Story = admin_db.model<IStory>('Story', StorySchema);
export const User_Story = user_db.model<IStory>('Story', StorySchema);
export const Story = Admin_Story;
