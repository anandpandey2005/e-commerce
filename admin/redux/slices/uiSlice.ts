import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  isAddProductOpen: boolean;
  isAddCategoryOpen: boolean;
  selectedProductId: string | null;
  isDrawerEditing: boolean;
  editingProductId: string | null;
}

const initialState: UiState = {
  isAddProductOpen: false,
  isAddCategoryOpen: false,
  selectedProductId: null,
  isDrawerEditing: false,
  editingProductId: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsAddProductOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddProductOpen = action.payload;
    },
    setIsAddCategoryOpen: (state, action: PayloadAction<boolean>) => {
      state.isAddCategoryOpen = action.payload;
    },
    setSelectedProductId: (state, action: PayloadAction<string | null>) => {
      state.selectedProductId = action.payload;
      if (action.payload === null) {
        state.isDrawerEditing = false;
      }
    },
    setIsDrawerEditing: (state, action: PayloadAction<boolean>) => {
      state.isDrawerEditing = action.payload;
    },
    setEditingProductId: (state, action: PayloadAction<string | null>) => {
      state.editingProductId = action.payload;
    },
    closeAllModals: (state) => {
      state.isAddProductOpen = false;
      state.isAddCategoryOpen = false;
      state.selectedProductId = null;
      state.editingProductId = null;
      state.isDrawerEditing = false;
    },
  },
});

export const {
  setIsAddProductOpen,
  setIsAddCategoryOpen,
  setSelectedProductId,
  setIsDrawerEditing,
  setEditingProductId,
  closeAllModals,
} = uiSlice.actions;

export default uiSlice.reducer;
