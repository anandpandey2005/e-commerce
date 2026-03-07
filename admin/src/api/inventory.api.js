import { http } from "./http";

const unwrapData = (response) => response?.data?.data ?? null;

export const inventoryApi = {
  getProducts: async () => {
    const response = await http.get("/api/v1/admin/products");
    return unwrapData(response);
  },
  createProduct: async (payload) => {
    const response = await http.post("/api/v1/admin/add-new-product", payload);
    return unwrapData(response);
  },
  updateProduct: async (id, payload) => {
    const response = await http.patch(`/api/v1/admin/update-product/${id}`, payload);
    return unwrapData(response);
  },
  deleteProduct: async (id) => {
    const response = await http.delete(`/api/v1/admin/delete-product/${id}`);
    return unwrapData(response);
  },
  getCategories: async () => {
    const response = await http.get("/api/v1/admin/categories");
    return unwrapData(response);
  },
  createCategory: async (payload) => {
    const response = await http.post("/api/v1/admin/add-new-category", payload);
    return unwrapData(response);
  },
  updateCategory: async (id, payload) => {
    const response = await http.patch(`/api/v1/admin/update-category/${id}`, payload);
    return unwrapData(response);
  },
  deleteCategory: async (id) => {
    const response = await http.delete(`/api/v1/admin/delete-category/${id}`);
    return unwrapData(response);
  },
};
