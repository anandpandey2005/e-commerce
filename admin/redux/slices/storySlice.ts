import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Story {
  id: string;
  title: string;
  mediaUrl: string;
  category: string;
  isActive: boolean;
  viewsCount: number;
}

interface StoryState {
  stories: Story[];
}

const initialState: StoryState = {
  stories: [
    { id: "STR-001", title: "Summer Tech Showcase", mediaUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600", category: "Promotions", isActive: true, viewsCount: 1420 },
    { id: "STR-002", title: "New Noise-Canceling Lineup", mediaUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600", category: "Product Launch", isActive: true, viewsCount: 890 },
    { id: "STR-003", title: "Flash Sale Alert 30% OFF", mediaUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", category: "Deals", isActive: false, viewsCount: 2300 },
  ],
};

export const storySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    addStory: (state, action: PayloadAction<Story>) => {
      state.stories.unshift(action.payload);
    },
    updateStory: (state, action: PayloadAction<Story>) => {
      const idx = state.stories.findIndex((s) => s.id === action.payload.id);
      if (idx !== -1) {
        state.stories[idx] = action.payload;
      }
    },
    deleteStory: (state, action: PayloadAction<string>) => {
      state.stories = state.stories.filter((s) => s.id !== action.payload);
    },
    toggleStoryStatus: (state, action: PayloadAction<string>) => {
      const story = state.stories.find((s) => s.id === action.payload);
      if (story) {
        story.isActive = !story.isActive;
      }
    },
  },
});

export const { addStory, updateStory, deleteStory, toggleStoryStatus } = storySlice.actions;

export default storySlice.reducer;
