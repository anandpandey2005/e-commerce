import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/constants";
import { IProduct, ICategory } from "@/lib/types";

interface CatalogState {
  products: IProduct[];
  categories: ICategory[];
}

const initialState: CatalogState = {
  products: MOCK_PRODUCTS,
  categories: MOCK_CATEGORIES,
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.products.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<IProduct>) => {
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p._id !== action.payload);
    },
    toggleProductStatus: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p._id === action.payload);
      if (product) {
        product.is_active = !product.is_active;
      }
    },
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<ICategory>) => {
      state.categories.push(action.payload);
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  setCategories,
  addCategory,
} = catalogSlice.actions;

export default catalogSlice.reducer;
