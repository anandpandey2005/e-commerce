import { create } from "zustand";
import { inventoryApi } from "../api/inventory.api";

const EMPTY_PRODUCT_FORM = {
  name: "",
  model: "",
  oldPrice: "",
  newPrice: "",
  stock: "",
  status: "active",
  categoryId: "",
  tags: "",
  description: "",
  brand: "",
  sku: "",
  imageFile: null,
  videoFile: null,
  existingImageUrl: "",
  existingVideoUrl: "",
};

const EMPTY_CATEGORY_FORM = {
  name: "",
};

const toErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Request failed.";

const categoryIdsFromProduct = (product) => {
  if (!Array.isArray(product?.category)) {
    return [];
  }

  return product.category
    .map((category) =>
      typeof category === "string" ? category : String(category?._id || "").trim(),
    )
    .filter(Boolean);
};

const mapProductToForm = (product) => {
  const categoryIds = categoryIdsFromProduct(product);
  const existingImageUrl =
    product?.mediaAssets?.find((asset) => asset?.assetType === "image")?.url ||
    (Array.isArray(product?.image) ? product.image[0] : "") ||
    "";
  const existingVideoUrl =
    product?.mediaAssets?.find(
      (asset) => asset?.assetType === "gallery" && asset?.resourceType === "video",
    )?.url ||
    (Array.isArray(product?.gallery) ? product.gallery[0] : "") ||
    "";

  return {
    name: String(product?.name || ""),
    model: String(product?.model || ""),
    oldPrice: Number.isFinite(product?.oldPrice) ? String(product.oldPrice) : "",
    newPrice: Number.isFinite(product?.newPrice) ? String(product.newPrice) : "",
    stock: Number.isFinite(product?.stock) ? String(product.stock) : "",
    status: String(product?.status || "active"),
    categoryId: categoryIds[0] || "",
    tags: Array.isArray(product?.tags) ? product.tags.join(", ") : "",
    description: String(product?.description || ""),
    brand: String(product?.brand || ""),
    sku: String(product?.sku || ""),
    imageFile: null,
    videoFile: null,
    existingImageUrl,
    existingVideoUrl,
  };
};

const buildProductPayload = (form) => {
  const payload = {
    name: String(form.name || "").trim(),
    model: String(form.model || "").trim(),
    oldPrice: Number(form.oldPrice),
    newPrice: Number(form.newPrice),
    status: String(form.status || "active").trim().toLowerCase(),
  };

  if (!payload.name || !payload.model) {
    throw new Error("Name and model are required.");
  }

  if (!Number.isFinite(payload.oldPrice) || !Number.isFinite(payload.newPrice)) {
    throw new Error("Old price and new price must be numbers.");
  }

  if (form.stock !== "") {
    const stock = Number(form.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      throw new Error("Stock must be a non-negative number.");
    }
    payload.stock = stock;
  }

  const tags = String(form.tags || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  if (tags.length) {
    payload.tags = tags;
  }

  const description = String(form.description || "").trim();
  if (description) {
    payload.description = description;
  }

  const brand = String(form.brand || "").trim();
  if (brand) {
    payload.brand = brand;
  }

  const sku = String(form.sku || "").trim();
  if (sku) {
    payload.sku = sku;
  }

  const categoryId = String(form.categoryId || "").trim();
  if (categoryId) {
    payload.category = [categoryId];
  }

  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("model", payload.model);
  formData.append("oldPrice", String(payload.oldPrice));
  formData.append("newPrice", String(payload.newPrice));
  formData.append("status", payload.status);

  if (payload.stock !== undefined) {
    formData.append("stock", String(payload.stock));
  }
  if (payload.tags) {
    formData.append("tags", JSON.stringify(payload.tags));
  }
  if (payload.description) {
    formData.append("description", payload.description);
  }
  if (payload.brand) {
    formData.append("brand", payload.brand);
  }
  if (payload.sku) {
    formData.append("sku", payload.sku);
  }
  if (payload.category) {
    formData.append("category", JSON.stringify(payload.category));
  }
  if (form.imageFile instanceof File) {
    formData.append("image", form.imageFile);
  }
  if (form.videoFile instanceof File) {
    formData.append("gallery", form.videoFile);
  }

  return formData;
};

const buildCategoryPayload = (form) => {
  const name = String(form.name || "").trim();
  if (!name) {
    throw new Error("Category name is required.");
  }
  return { name };
};

const useInventoryStore = create((set, get) => ({
  products: [],
  categories: [],
  productForm: { ...EMPTY_PRODUCT_FORM },
  categoryForm: { ...EMPTY_CATEGORY_FORM },
  editingProductId: null,
  editingCategoryId: null,
  loadingProducts: false,
  loadingCategories: false,
  savingProduct: false,
  savingCategory: false,
  deletingProductId: null,
  deletingCategoryId: null,
  error: "",
  successMessage: "",

  setProductField: (field, value) =>
    set((state) => ({
      productForm: {
        ...state.productForm,
        [field]: value,
      },
    })),

  setProductMediaFile: (field, file) =>
    set((state) => ({
      productForm: {
        ...state.productForm,
        [field]: file || null,
      },
    })),

  setCategoryField: (field, value) =>
    set((state) => ({
      categoryForm: {
        ...state.categoryForm,
        [field]: value,
      },
    })),

  startEditProduct: (product) =>
    set({
      editingProductId: product?._id || null,
      productForm: mapProductToForm(product),
      error: "",
      successMessage: "",
    }),

  cancelEditProduct: () =>
    set({
      editingProductId: null,
      productForm: { ...EMPTY_PRODUCT_FORM },
    }),

  startEditCategory: (category) =>
    set({
      editingCategoryId: category?._id || null,
      categoryForm: {
        name: String(category?.name || ""),
      },
      error: "",
      successMessage: "",
    }),

  cancelEditCategory: () =>
    set({
      editingCategoryId: null,
      categoryForm: { ...EMPTY_CATEGORY_FORM },
    }),

  clearFeedback: () =>
    set({
      error: "",
      successMessage: "",
    }),

  fetchProducts: async () => {
    set({ loadingProducts: true });
    try {
      const products = await inventoryApi.getProducts();
      set({
        products: Array.isArray(products) ? products : [],
        loadingProducts: false,
      });
    } catch (error) {
      set({
        loadingProducts: false,
        error: toErrorMessage(error),
      });
    }
  },

  fetchCategories: async () => {
    set({ loadingCategories: true });
    try {
      const categories = await inventoryApi.getCategories();
      set({
        categories: Array.isArray(categories) ? categories : [],
        loadingCategories: false,
      });
    } catch (error) {
      set({
        loadingCategories: false,
        error: toErrorMessage(error),
      });
    }
  },

  loadInventory: async () => {
    await Promise.all([get().fetchProducts(), get().fetchCategories()]);
  },

  saveProduct: async () => {
    set({ savingProduct: true, error: "", successMessage: "" });
    try {
      const { editingProductId, productForm } = get();
      const payload = buildProductPayload(productForm);

      if (editingProductId) {
        await inventoryApi.updateProduct(editingProductId, payload);
      } else {
        await inventoryApi.createProduct(payload);
      }

      await get().fetchProducts();

      set({
        savingProduct: false,
        editingProductId: null,
        productForm: { ...EMPTY_PRODUCT_FORM },
        successMessage: editingProductId
          ? "Product updated successfully."
          : "Product created successfully.",
      });

      return true;
    } catch (error) {
      set({
        savingProduct: false,
        error: toErrorMessage(error),
      });
      return false;
    }
  },

  deleteProduct: async (id) => {
    set({ deletingProductId: id, error: "", successMessage: "" });
    try {
      await inventoryApi.deleteProduct(id);
      await get().fetchProducts();
      set({
        deletingProductId: null,
        successMessage: "Product deleted successfully.",
      });
      return true;
    } catch (error) {
      set({
        deletingProductId: null,
        error: toErrorMessage(error),
      });
      return false;
    }
  },

  saveCategory: async () => {
    set({ savingCategory: true, error: "", successMessage: "" });
    try {
      const { editingCategoryId, categoryForm } = get();
      const payload = buildCategoryPayload(categoryForm);

      if (editingCategoryId) {
        await inventoryApi.updateCategory(editingCategoryId, payload);
      } else {
        await inventoryApi.createCategory(payload);
      }

      await get().fetchCategories();

      set({
        savingCategory: false,
        editingCategoryId: null,
        categoryForm: { ...EMPTY_CATEGORY_FORM },
        successMessage: editingCategoryId
          ? "Category updated successfully."
          : "Category created successfully.",
      });

      return true;
    } catch (error) {
      set({
        savingCategory: false,
        error: toErrorMessage(error),
      });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ deletingCategoryId: id, error: "", successMessage: "" });
    try {
      await inventoryApi.deleteCategory(id);
      await Promise.all([get().fetchCategories(), get().fetchProducts()]);
      set({
        deletingCategoryId: null,
        successMessage: "Category deleted successfully.",
      });
      return true;
    } catch (error) {
      set({
        deletingCategoryId: null,
        error: toErrorMessage(error),
      });
      return false;
    }
  },
}));

export default useInventoryStore;
