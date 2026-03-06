import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { apiResponse } from "../utils/response/apiResponse.utils.js";
import { apiError } from "../utils/response/apiError.utils.js";

export const isSuperAdmin = async (req, res, next) => {
  if (req.user?.role !== "superAdmin") {
    return apiError.errorResponse(res, 403, "Access denied");
  }
  next();
};

export const isAdmin = async (req, res, next) => {
  const allowedRoles = ["admin"];

  if (!allowedRoles.includes(req.user?.role)) {
    return apiError.errorResponse(res, 403, "Access denied");
  }
  next();
};

export const isUser = async (req, res, next) => {
  if (!req.user) {
    return apiResponse.errorResponse(res, 403, "Access denied");
  }
  next();
};
