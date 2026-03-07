import express from "express";
import {
  addNewCategory,
  deleteCategoryById,
  getCategory,
  updateCategoryById,
} from "../controller/category.controller.js";
import {
  addNewProduct,
  deleteProductById,
  getAlLProduct,
  updateProductById,
} from "../controller/product.controller.js";
import {
  uploadCategoryImage,
  uploadProductAssets,
} from "../middleware/multer.middleware.js";

const adminRoutes = express.Router();

adminRoutes.post("/add-new-product", uploadProductAssets, addNewProduct);
adminRoutes.post("/add-new-category", uploadCategoryImage, addNewCategory);
adminRoutes.get("/categories", getCategory);
adminRoutes.get("/products", getAlLProduct);

adminRoutes.delete("/delete-product", deleteProductById);
adminRoutes.delete("/delete-product/:id", deleteProductById);
adminRoutes.patch("/update-product/:id", uploadProductAssets, updateProductById);
adminRoutes.patch("/update-category/:id", uploadCategoryImage, updateCategoryById);
adminRoutes.delete("/delete-category/:id", deleteCategoryById);

export default adminRoutes;
