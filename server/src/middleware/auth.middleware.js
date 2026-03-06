import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/response/apiResponse.utils.js";
import { apiError } from "../utils/response/apiError.utils.js";

export const verifyAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return apiError.errorResponse(res, 401, "Authentication required.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return apiError.errorResponse(res, 404, "User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    return apiError.errorResponse(res, 401, "Invalid or expired token.");
  }
};
