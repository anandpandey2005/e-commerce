import mongoose, { Schema } from 'mongoose';
import { IStory } from './types/story.js';

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

export const Story = mongoose.model<IStory>('Story', StorySchema);
