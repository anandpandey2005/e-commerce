import { apiResponse } from "../utils/response/apiResponse.utils.js";
import { apiError } from "../utils/response/apiError.utils.js";
import { Category } from "../models/category.model.js";

export const get_all_category = async (req, res) => {
  try {
    const result = await Category.find().lean();
    if (result.length < 1 || result == undefined) {
      throw new Error("NOT_FOUND");
    }
    return apiResponse.success(res, 200, result, "fetched");
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return apiError.errorResponse(res, 404, "No Categories Found");
    }
    return apiError.errorResponse(res);
  }
};
