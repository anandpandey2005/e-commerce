import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryState {
  selectedCategoryId: string;
  viewMode: "list" | "grid";
  stockFilter: "all" | "in_stock" | "low_stock";
}

const initialState: InventoryState = {
  selectedCategoryId: "all",
  viewMode: "list",
  stockFilter: "all",
};

export const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setSelectedCategoryId: (state, action: PayloadAction<string>) => {
      state.selectedCategoryId = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"list" | "grid">) => {
      state.viewMode = action.payload;
    },
    setStockFilter: (state, action: PayloadAction<"all" | "in_stock" | "low_stock">) => {
      state.stockFilter = action.payload;
    },
  },
});

export const { setSelectedCategoryId, setViewMode, setStockFilter } = inventorySlice.actions;

export default inventorySlice.reducer;
