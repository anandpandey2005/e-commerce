import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { apiError } from "../utils/response/apiError.utils.js";
import { getCloudinaryClient } from "../config/cloudinary/cloudinary.config.js";

const cloudinary = getCloudinaryClient();

const PRODUCT_UPLOAD_FIELDS = [
  { name: "image", maxCount: 10 },
  { name: "brousher", maxCount: 1 },
  { name: "brochure", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
];

const CATEGORY_UPLOAD_FIELDS = [
  { name: "image", maxCount: 1 },
  { name: "categoryImage", maxCount: 1 },
];

const PRODUCT_ALLOWED_MIME_BY_FIELD = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  gallery: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-m4v",
  ],
  brousher: ["application/pdf"],
  brochure: ["application/pdf"],
};

const CATEGORY_ALLOWED_MIME_BY_FIELD = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  categoryImage: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
};

const PRODUCT_FIELD_TO_ASSET_FOLDER = {
  image: "image",
  gallery: "gallery",
  brousher: "brousher",
  brochure: "brousher",
};

const CATEGORY_FIELD_TO_ASSET_FOLDER = {
  image: "image",
  categoryImage: "image",
};

const PRODUCT_FIELD_TO_RESOURCE_TYPE = {
  image: "image",
  gallery: "auto",
  brousher: "raw",
  brochure: "raw",
};

const CATEGORY_FIELD_TO_RESOURCE_TYPE = {
  image: "image",
  categoryImage: "image",
};

const PRODUCT_FIELD_TO_ALLOWED_FORMATS = {
  image: ["jpg", "jpeg", "png", "webp"],
  gallery: ["jpg", "jpeg", "png", "webp", "mp4", "webm", "mov", "m4v"],
  brousher: ["pdf"],
  brochure: ["pdf"],
};

const CATEGORY_FIELD_TO_ALLOWED_FORMATS = {
  image: ["jpg", "jpeg", "png", "webp"],
  categoryImage: ["jpg", "jpeg", "png", "webp"],
};

const DEFAULT_ALLOWED_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "mp4",
  "webm",
  "mov",
  "m4v",
  "pdf",
];

const sanitizePathSegment = (value, fallback) => {
  const normalized = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return normalized || fallback;
};

const getStoreFolder = (folderValue, fallback) =>
  sanitizePathSegment(folderValue || fallback, fallback);

const getProductFolderName = (req) => {
  const productName =
    req.body?.model ||
    req.body?.name ||
    req.body?.productName ||
    req.body?.product ||
    "untitled-product";

  return sanitizePathSegment(productName, "untitled-product");
};

const getCategoryFolderName = (req) => {
  const categoryName =
    req.body?.name ||
    req.body?.categoryName ||
    req.body?.category ||
    "untitled-category";

  return sanitizePathSegment(categoryName, "untitled-category");
};

const createPublicId = (entityFolderName, assetFolder, file) => {
  const originalFileName =
    file.originalname?.replace(/\.[^/.]+$/, "") || "asset";
  const normalizedOriginalName = sanitizePathSegment(originalFileName, "asset");
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${entityFolderName}-${assetFolder}-${normalizedOriginalName}-${uniqueSuffix}`;
};

const createFileFilter = (allowedMimeByField, unexpectedFieldMessage) => {
  return (req, file, callback) => {
    const allowed = allowedMimeByField[file.fieldname];

    if (!allowed) {
      return callback(new Error(unexpectedFieldMessage));
    }

    if (!allowed.includes(file.mimetype)) {
      return callback(new Error(`Invalid file type for "${file.fieldname}".`));
    }

    return callback(null, true);
  };
};

const createCloudinaryStorage = ({
  rootFolderEnvKey,
  rootFolderFallback,
  getEntityFolderName,
  fieldToAssetFolder,
  fieldToResourceType,
  fieldToAllowedFormats,
}) =>
  new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const storeName = getStoreFolder(process.env.STORE_NAME, "my-store");
      const rootFolder = getStoreFolder(
        process.env[rootFolderEnvKey],
        rootFolderFallback,
      );
      const entityFolderName = getEntityFolderName(req);
      const assetFolder = fieldToAssetFolder[file.fieldname] || "others";

      const config = {
        folder: `${storeName}/${rootFolder}/${entityFolderName}/${assetFolder}`,
        resource_type: fieldToResourceType[file.fieldname] || "auto",
        allowed_formats: fieldToAllowedFormats[file.fieldname] || DEFAULT_ALLOWED_FORMATS,
        public_id: createPublicId(entityFolderName, assetFolder, file),
      };

      if (file.fieldname === "gallery" && file.mimetype?.includes("video")) {
        config.transformation = [{ streaming_profile: "full_hd", format: "m3u8" }];
        config.format = "m3u8";
      }

      return config;
    },
  });

const createUploader = ({ storage, fileFilter, maxFiles }) => {
  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 15 * 1024 * 1024,
      files: maxFiles,
    },
  });
};

const handleMulterError = (res, error, errorMessagesByCode) => {
  if (error instanceof multer.MulterError) {
    const message = errorMessagesByCode[error.code] || error.message;
    return apiError.errorResponse(res, 400, message);
  }

  return apiError.errorResponse(res, 400, error.message || "File upload failed.");
};

const productStorage = createCloudinaryStorage({
  rootFolderEnvKey: "PRODUCTS_FOLDER",
  rootFolderFallback: "products",
  getEntityFolderName: getProductFolderName,
  fieldToAssetFolder: PRODUCT_FIELD_TO_ASSET_FOLDER,
  fieldToResourceType: PRODUCT_FIELD_TO_RESOURCE_TYPE,
  fieldToAllowedFormats: PRODUCT_FIELD_TO_ALLOWED_FORMATS,
});

const productFileFilter = createFileFilter(
  PRODUCT_ALLOWED_MIME_BY_FIELD,
  "Unexpected file field. Allowed fields are image, gallery, brousher or brochure.",
);

const productUpload = createUploader({
  storage: productStorage,
  fileFilter: productFileFilter,
  maxFiles: 12,
});

export const upload = productUpload;

const uploadProductFields = productUpload.fields(PRODUCT_UPLOAD_FIELDS);

const PRODUCT_MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: "One of the uploaded files exceeds 15MB.",
  LIMIT_FILE_COUNT: "Too many files uploaded in one request.",
  LIMIT_UNEXPECTED_FILE:
    "Unexpected file field. Use image, gallery, brousher or brochure.",
};

export const uploadProductAssets = (req, res, next) => {
  uploadProductFields(req, res, (error) => {
    if (!error) {
      return next();
    }

    return handleMulterError(res, error, PRODUCT_MULTER_ERROR_MESSAGES);
  });
};

const categoryStorage = createCloudinaryStorage({
  rootFolderEnvKey: "CATEGORIES_FOLDER",
  rootFolderFallback: "categories",
  getEntityFolderName: getCategoryFolderName,
  fieldToAssetFolder: CATEGORY_FIELD_TO_ASSET_FOLDER,
  fieldToResourceType: CATEGORY_FIELD_TO_RESOURCE_TYPE,
  fieldToAllowedFormats: CATEGORY_FIELD_TO_ALLOWED_FORMATS,
});

const categoryFileFilter = createFileFilter(
  CATEGORY_ALLOWED_MIME_BY_FIELD,
  "Unexpected file field. Use image or categoryImage.",
);

const categoryUpload = createUploader({
  storage: categoryStorage,
  fileFilter: categoryFileFilter,
  maxFiles: 1,
});

const uploadCategoryFields = categoryUpload.fields(CATEGORY_UPLOAD_FIELDS);

const CATEGORY_MULTER_ERROR_MESSAGES = {
  LIMIT_FILE_SIZE: "Category image must be 15MB or smaller.",
  LIMIT_FILE_COUNT: "Only one category image can be uploaded in one request.",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field. Use image or categoryImage.",
};

export const uploadCategoryImage = (req, res, next) => {
  uploadCategoryFields(req, res, (error) => {
    if (!error) {
      return next();
    }

    return handleMulterError(res, error, CATEGORY_MULTER_ERROR_MESSAGES);
  });
};

export { PRODUCT_UPLOAD_FIELDS, CATEGORY_UPLOAD_FIELDS };
