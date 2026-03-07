import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { getCloudinaryClient } from "../config/cloudinary/cloudinary.config.js";
import { apiError } from "../utils/response/apiError.utils.js";
import { apiResponse } from "../utils/response/apiResponse.utils.js";

const cloudinary = getCloudinaryClient();
const CLOUDINARY_HOST = "res.cloudinary.com";

const normalizeCategoryId = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const getCategoryNameFromBody = (body) =>
  String(body?.name || body?.categoryName || body?.category || "")
    .trim()
    .toLowerCase();

const resolveCategoryId = (req) => {
  const fromParam = String(req?.params?.id || "").trim();
  if (fromParam) {
    return fromParam;
  }

  const body = req?.body;
  if (typeof body === "string") {
    const rawBody = body.trim();
    return rawBody || null;
  }

  const bodyId = String(body?._id || body?.id || "").trim();
  return bodyId || null;
};

const extractCloudinaryPublicIdFromUrl = (url) => {
  if (typeof url !== "string" || !url.includes(CLOUDINARY_HOST)) {
    return null;
  }

  const cleanedUrl = url.split("?")[0];
  const marker = "/upload/";
  const markerIndex = cleanedUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  let segments = cleanedUrl
    .slice(markerIndex + marker.length)
    .split("/")
    .filter(Boolean);

  if (
    segments.length > 1 &&
    !/^v\d+$/.test(segments[0]) &&
    /^v\d+$/.test(segments[1])
  ) {
    segments = segments.slice(1);
  }

  if (segments.length && /^v\d+$/.test(segments[0])) {
    segments = segments.slice(1);
  }

  if (!segments.length) {
    return null;
  }

  segments[segments.length - 1] = segments[segments.length - 1].replace(
    /\.[a-zA-Z0-9]+$/,
    "",
  );

  const publicId = decodeURIComponent(segments.join("/"));
  return publicId || null;
};

const getUploadedCategoryImage = (req) =>
  req.files?.image?.[0] || req.files?.categoryImage?.[0] || req.file || null;

const getCategoryImagePayload = (req) => {
  const file = getUploadedCategoryImage(req);

  if (!file?.path) {
    return { image: null, imagePublicId: null };
  }

  const imagePublicId = file.filename || extractCloudinaryPublicIdFromUrl(file.path);

  return {
    image: file.path,
    imagePublicId: imagePublicId || null,
  };
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      type: "upload",
      invalidate: true,
    });
  } catch (error) {
    console.error("Cloud category image cleanup failed:", error?.message || error);
  }
};

export const getCategory = async (req, res) => {
  try {
    const result = await Category.find().sort({ createdAt: 1 }).lean();

    if (!result || result.length === 0) {
      return apiResponse.success(res, 200, [], "Categories coming soon");
    }

    return apiResponse.success(res, 200, result, "Data fetched successfully");
  } catch (err) {
    return apiError.errorResponse(
      res,
      500,
      "Internal Server Error",
      err.message,
    );
  }
};

export const addNewCategory = async (req, res) => {
  let uploadedImagePublicId = null;

  try {
    const data = req?.body || {};
    const categoryName = getCategoryNameFromBody(data);

    if (!categoryName) {
      return apiError.errorResponse(res, 400, "Category name is required.");
    }

    const categoryId = normalizeCategoryId(categoryName);
    if (!categoryId) {
      return apiError.errorResponse(
        res,
        400,
        "Category name contains only unsupported characters.",
      );
    }

    const { image, imagePublicId } = getCategoryImagePayload(req);
    uploadedImagePublicId = imagePublicId;

    const categoryPayload = {
      _id: categoryId,
      name: categoryName,
    };

    if (image) {
      categoryPayload.image = image;
    }

    if (imagePublicId) {
      categoryPayload.image_public_id = imagePublicId;
    }

    const newCategory = await Category.create(categoryPayload);

    return apiResponse.success(
      res,
      201,
      newCategory,
      "Category added successfully",
    );
  } catch (err) {
    if (uploadedImagePublicId) {
      await deleteCloudinaryImage(uploadedImagePublicId);
    }

    if (err?.code === 11000) {
      return apiError.errorResponse(res, 409, "Category already exists.");
    }

    return apiError.errorResponse(
      res,
      500,
      err.message || "Failed to add category.",
    );
  }
};

export const updateCategoryById = async (req, res) => {
  let uploadedImagePublicId = null;

  try {
    const categoryId = resolveCategoryId(req);
    if (!categoryId) {
      return apiError.errorResponse(res, 400, "Category id is required.");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return apiError.errorResponse(res, 404, "Category not found.");
    }

    const data = req?.body || {};
    const updates = {};

    if (
      data.name !== undefined ||
      data.categoryName !== undefined ||
      data.category !== undefined
    ) {
      const categoryName = getCategoryNameFromBody(data);
      if (!categoryName) {
        return apiError.errorResponse(res, 400, "Category name cannot be empty.");
      }
      updates.name = categoryName;
    }

    const { image, imagePublicId } = getCategoryImagePayload(req);
    uploadedImagePublicId = imagePublicId;

    const previousImagePublicId = category.image_public_id || null;

    if (image) {
      updates.image = image;
      updates.image_public_id = imagePublicId || null;
    }

    Object.assign(category, updates);
    await category.save();

    if (
      image &&
      previousImagePublicId &&
      previousImagePublicId !== updates.image_public_id
    ) {
      await deleteCloudinaryImage(previousImagePublicId);
    }

    return apiResponse.success(
      res,
      200,
      category,
      "Category updated successfully",
    );
  } catch (err) {
    if (uploadedImagePublicId) {
      await deleteCloudinaryImage(uploadedImagePublicId);
    }

    if (err?.code === 11000) {
      return apiError.errorResponse(res, 409, "Category already exists.");
    }

    return apiError.errorResponse(
      res,
      500,
      err.message || "Failed to update category.",
    );
  }
};

export const deleteCategoryById = async (req, res) => {
  try {
    const categoryId = resolveCategoryId(req);
    if (!categoryId) {
      return apiError.errorResponse(res, 400, "Category id is required.");
    }

    const deletedCategory = await Category.findOneAndDelete({ _id: categoryId }).lean();
    if (!deletedCategory) {
      return apiError.errorResponse(res, 404, "Category not found.");
    }

    await Product.updateMany(
      { category: categoryId },
      { $pull: { category: categoryId } },
    );

    return apiResponse.success(
      res,
      200,
      { deleted_id: categoryId },
      "Category deleted successfully",
    );
  } catch (err) {
    return apiError.errorResponse(
      res,
      500,
      err.message || "Failed to delete category.",
    );
  }
};
