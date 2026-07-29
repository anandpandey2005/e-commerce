import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IProduct, ICategory } from "@/lib/types";
import { adminFetch, SERVER_URI } from "@/lib/apiClient";

export const fetchCategories = createAsyncThunk(
  "catalog/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminFetch(`${SERVER_URI}/public/categories`);
      if (!response.ok) {
        throw new Error(`Failed to fetch categories (${response.status})`);
      }
      const data = await response.json();
      const categories: ICategory[] =
        data?.data?.categories ||
        data?.categories ||
        (Array.isArray(data) ? data : []);
      return categories;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

export const fetchProducts = createAsyncThunk(
  "catalog/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminFetch(`${SERVER_URI}/public/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products (${response.status})`);
      }
      const data = await response.json();
      const products: IProduct[] =
        data?.data?.products ||
        data?.products ||
        (Array.isArray(data) ? data : []);
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "catalog/createProduct",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await adminFetch(`${SERVER_URI}/admin/inventory/product/add`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to create product (${response.status})`);
      }

      const newProduct: IProduct = data?.data?.product || data?.product;
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create product");
    }
  }
);

interface CatalogState {
  products: IProduct[];
  categories: ICategory[];
  loadingCategories: boolean;
  loadingProducts: boolean;
  creatingProduct: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  products: [],
  categories: [],
  loadingCategories: false,
  loadingProducts: false,
  creatingProduct: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
        state.loadingCategories = false;
        state.categories = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loadingCategories = false;
        state.error = (action.payload as string) || action.error.message || "Failed to fetch categories";
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loadingProducts = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.loadingProducts = false;
        state.products = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = (action.payload as string) || action.error.message || "Failed to fetch products";
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.creatingProduct = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.creatingProduct = false;
        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creatingProduct = false;
        state.error = (action.payload as string) || action.error.message || "Failed to create product";
      });
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

