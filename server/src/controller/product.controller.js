import { Product } from "../models/product.model.js";
import { apiError } from "../utils/apiError.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";

//######################## Get All Products ##########################
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find().populate("category").lean();

    if (!products || products.length === 0) {
      return apiResponse.success(res, 200, "No products found.", []);
    }

    return apiResponse.success(
      res,
      200,
      "Products retrieved successfully.",
      products
    );
  } catch (err) {
    console.error("Error in getProduct controller:", err.message, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "An internal server error occurred.";
    const errors = err.errors || [];
    return apiError.erroRresponse(res, statusCode, message, errors);
  }
};

//######################## Add New Product ##########################
export const addNewProduct = async (req, res) => {
  try {
  } catch (err) {
    console.error("Error in getProduct controller:", err.message, err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "An internal server error occurred.";
    const errors = err.errors || [];
    return apiError.erroRresponse(res, statusCode, message, errors);
  }
};
