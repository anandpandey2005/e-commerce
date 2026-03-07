import { Product } from "../models/product.model.js";
import { apiError } from "../utils/response/apiError.utils.js";
import { apiResponse } from "../utils/response/apiResponse.utils.js";
import { getCloudinaryClient } from "../config/cloudinary/cloudinary.config.js";

const cloudinary = getCloudinaryClient();

const CLOUDINARY_HOST = "res.cloudinary.com";
const ALLOWED_PRODUCT_STATUSES = new Set(["draft", "active", "archived"]);

const parsePossiblyJson = (value, fieldName) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const looksLikeJson =
    trimmed.startsWith("[") ||
    trimmed.startsWith("{") ||
    trimmed.startsWith('"');

  if (!looksLikeJson) {
    return trimmed;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    throw new apiError(400, `Invalid JSON format for "${fieldName}".`);
  }
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes"].includes(normalized)) {
    return true;
  }
  if (["0", "false", "no"].includes(normalized)) {
    return false;
  }

  return undefined;
};

const parseTags = (value) => {
  const parsed = parsePossiblyJson(value, "tags");

  if (parsed === undefined) {
    return undefined;
  }

  if (Array.isArray(parsed)) {
    return [
      ...new Set(
        parsed
          .map((tag) =>
            String(tag || "")
              .trim()
              .toLowerCase(),
          )
          .filter(Boolean),
      ),
    ];
  }

  if (typeof parsed === "string") {
    return [
      ...new Set(
        parsed
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ];
  }

  throw new apiError(400, 'Invalid format for "tags".');
};

const parseCategory = (value) => {
  const parsed = parsePossiblyJson(value, "category");

  if (parsed === undefined) {
    return undefined;
  }

  if (Array.isArray(parsed)) {
    const normalized = parsed
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return normalized.length ? normalized : [];
  }

  if (typeof parsed === "string") {
    const asList = parsed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return asList.length ? asList : [];
  }

  throw new apiError(400, 'Invalid format for "category".');
};

const resolveProductId = (req) => {
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

const getResourceTypeFromUrl = (url) => {
  if (typeof url !== "string") {
    return null;
  }

  const match = url.match(/\/(image|video|raw)\/upload\//);
  return match?.[1] || null;
};

const injectCloudinaryTransformation = (url, transformation) => {
  if (typeof url !== "string" || !url.includes(CLOUDINARY_HOST)) {
    return url;
  }

  const [baseUrl, queryString] = url.split("?");
  const marker = "/upload/";
  const markerIndex = baseUrl.indexOf(marker);

  if (markerIndex === -1) {
    return url;
  }

  const prefix = baseUrl.slice(0, markerIndex + marker.length);
  const suffix = baseUrl.slice(markerIndex + marker.length);
  let parts = suffix.split("/").filter(Boolean);

  if (!parts.length) {
    return url;
  }

  const hasTransformation =
    parts.length > 1 && !/^v\d+$/.test(parts[0]) && /^v\d+$/.test(parts[1]);

  if (hasTransformation) {
    parts = [transformation, ...parts.slice(1)];
  } else {
    parts = [transformation, ...parts];
  }

  const transformed = `${prefix}${parts.join("/")}`;
  return queryString ? `${transformed}?${queryString}` : transformed;
};

const createAdaptiveVideoUrl = (url) => {
  const transformedUrl = injectCloudinaryTransformation(url, "sp_auto");

  if (/\.[a-zA-Z0-9]+($|\?)/.test(transformedUrl)) {
    return transformedUrl.replace(/\.[a-zA-Z0-9]+(?=($|\?))/, ".m3u8");
  }

  const [baseUrl, queryString] = transformedUrl.split("?");
  const withExt = `${baseUrl}.m3u8`;
  return queryString ? `${withExt}?${queryString}` : withExt;
};

const extractCloudinaryAssetFromUrl = (url) => {
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
  if (!publicId) {
    return null;
  }

  return {
    publicId,
    resourceType: getResourceTypeFromUrl(cleanedUrl) || "image",
  };
};

const buildMediaAsset = (file, assetType) => {
  if (!file?.path) {
    return null;
  }

  const normalizedAssetType = assetType === "brochure" ? "brousher" : assetType;
  const extracted = extractCloudinaryAssetFromUrl(file.path);
  const mimeIsVideo = Boolean(file?.mimetype?.startsWith("video/"));
  const extensionIsVideo = /\.(mp4|mov|m4v|webm|mkv|avi)$/i.test(
    file.originalname || "",
  );
  const cloudinarySaysVideo = extracted?.resourceType === "video";

  const resourceType =
    normalizedAssetType === "brousher"
      ? "raw"
      : mimeIsVideo || extensionIsVideo || cloudinarySaysVideo
        ? "video"
        : "image";

  const publicId = file.filename || extracted?.publicId;

  if (!publicId) {
    return null;
  }

  let deliveryUrl = file.path;
  if (resourceType === "image") {
    deliveryUrl = injectCloudinaryTransformation(file.path, "f_auto,q_auto");
  }
  if (resourceType === "video") {
    deliveryUrl = injectCloudinaryTransformation(
      file.path,
      "f_auto,q_auto:good,vc_auto",
    );
  }

  return {
    assetType: normalizedAssetType,
    url: file.path,
    publicId,
    resourceType,
    originalName: file.originalname || null,
    mimeType: file.mimetype || null,
    bytes: Number.isFinite(file.size) ? file.size : null,
    deliveryUrl,
    adaptiveUrl:
      resourceType === "video" ? createAdaptiveVideoUrl(file.path) : null,
  };
};

const collectCloudinaryAssetsForDelete = (product) => {
  const deduped = new Map();

  if (Array.isArray(product?.mediaAssets) && product.mediaAssets.length) {
    for (const asset of product.mediaAssets) {
      const publicId = asset?.publicId?.trim();
      if (!publicId) {
        continue;
      }

      const resourceType =
        asset.resourceType || getResourceTypeFromUrl(asset.url) || "image";
      deduped.set(`${resourceType}:${publicId}`, { publicId, resourceType });
    }
  }

  if (!deduped.size) {
    const legacyUrls = [
      ...(Array.isArray(product?.image) ? product.image : []),
      ...(Array.isArray(product?.gallery) ? product.gallery : []),
      product?.brousher,
    ].filter(Boolean);

    for (const assetUrl of legacyUrls) {
      const asset = extractCloudinaryAssetFromUrl(assetUrl);
      if (!asset?.publicId) {
        continue;
      }
      deduped.set(`${asset.resourceType}:${asset.publicId}`, asset);
    }
  }

  return Array.from(deduped.values());
};

const deleteCloudinaryAssets = async (assets) => {
  if (!Array.isArray(assets) || !assets.length) {
    return;
  }

  const groupedByType = assets.reduce((acc, asset) => {
    const type = asset.resourceType || "image";
    if (!acc[type]) {
      acc[type] = new Set();
    }
    acc[type].add(asset.publicId);
    return acc;
  }, {});

  for (const [resourceType, idsSet] of Object.entries(groupedByType)) {
    const publicIds = Array.from(idsSet);
    if (!publicIds.length) {
      continue;
    }

    await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType,
      type: "upload",
      invalidate: true,
    });
  }
};

export const addNewProduct = async (req, res) => {
  try {
    const data = req?.body || {};
    const name = String(data.name || "").trim();
    const model = String(data.model || "").trim();

    if (!name || !model) {
      return apiError.errorResponse(
        res,
        400,
        "Both name and model are required.",
      );
    }

    const oldPrice = Number(data.oldPrice);
    const newPrice = Number(data.newPrice);

    if (!Number.isFinite(oldPrice) || !Number.isFinite(newPrice)) {
      return apiError.errorResponse(
        res,
        400,
        "oldPrice and newPrice must be valid numbers.",
      );
    }

    const stockValue = data.stock;
    const stock = stockValue === undefined ? undefined : Number(stockValue);
    if (stockValue !== undefined && (!Number.isFinite(stock) || stock < 0)) {
      return apiError.errorResponse(
        res,
        400,
        "stock must be a non-negative number.",
      );
    }

    const status = data.status
      ? String(data.status).trim().toLowerCase()
      : undefined;
    if (status && !ALLOWED_PRODUCT_STATUSES.has(status)) {
      return apiError.errorResponse(
        res,
        400,
        'status must be one of: "draft", "active", "archived".',
      );
    }

    const isFeatured = parseBoolean(data.isFeatured);
    if (data.isFeatured !== undefined && isFeatured === undefined) {
      return apiError.errorResponse(
        res,
        400,
        "isFeatured must be true or false.",
      );
    }

    const tags = parseTags(data.tags);

    const imageAssets =
      req.files?.image
        ?.map((file) => buildMediaAsset(file, "image"))
        .filter(Boolean) || [];
    const galleryAssets =
      req.files?.gallery
        ?.map((file) => buildMediaAsset(file, "gallery"))
        .filter(Boolean) || [];
    const brochureFile = req.files?.brousher?.[0] || req.files?.brochure?.[0];
    const brochureAsset = brochureFile
      ? buildMediaAsset(brochureFile, "brousher")
      : null;

    const categoryValue = parseCategory(data.category);
    const specificationsValue = parsePossiblyJson(
      data.specifications,
      "specifications",
    );

    if (
      specificationsValue !== undefined &&
      !Array.isArray(specificationsValue)
    ) {
      return apiError.errorResponse(
        res,
        400,
        "specifications must be an array or a JSON array string.",
      );
    }

    const productFields = {
      name,
      model,
      oldPrice,
      newPrice,
      description: data.description,
    };

    if (data.sku) productFields.sku = String(data.sku).trim().toUpperCase();
    if (data.brand)
      productFields.brand = String(data.brand).trim().toLowerCase();
    if (stock !== undefined) productFields.stock = stock;
    if (status) productFields.status = status;
    if (isFeatured !== undefined) productFields.isFeatured = isFeatured;
    if (tags !== undefined) productFields.tags = tags;

    const mediaAssets = [
      ...imageAssets,
      ...galleryAssets,
      ...(brochureAsset ? [brochureAsset] : []),
    ];

    const imageUrls = imageAssets.map((asset) => asset.url);
    const galleryUrls = galleryAssets.map((asset) =>
      asset.resourceType === "video"
        ? asset.adaptiveUrl || asset.url
        : asset.url,
    );
    const brochureUrl = brochureAsset?.url;

    if (imageUrls.length) productFields.image = imageUrls;
    if (galleryUrls.length) productFields.gallery = galleryUrls;
    if (brochureUrl) productFields.brousher = brochureUrl;
    if (mediaAssets.length) productFields.mediaAssets = mediaAssets;

    if (categoryValue !== undefined) {
      productFields.category = categoryValue;
    }

    if (specificationsValue !== undefined) {
      productFields.specifications = specificationsValue;
    }

    const newProduct = await Product.create(productFields);

    const responseData = {
      ...newProduct.toObject(),
      mediaDelivery: {
        image: mediaAssets
          .filter((asset) => asset.assetType === "image")
          .map((asset) => asset.deliveryUrl || asset.url),
        gallery: mediaAssets
          .filter((asset) => asset.assetType === "gallery")
          .map((asset) => ({
            url:
              asset.resourceType === "video"
                ? asset.adaptiveUrl || asset.url
                : asset.deliveryUrl || asset.url,
            type: asset.resourceType,
            adaptiveUrl: asset.adaptiveUrl || null,
          })),
        brousher:
          mediaAssets.find((asset) => asset.assetType === "brousher")?.url ||
          null,
      },
    };

    return apiResponse.success(
      res,
      201,
      responseData,
      "Product added successfully",
    );
  } catch (error) {
    if (error instanceof apiError) {
      return apiError.errorResponse(res, error.statusCode, error.message);
    }

    if (error?.code === 11000) {
      return apiError.errorResponse(
        res,
        409,
        "Product with same name or model already exists.",
      );
    }

    return apiError.errorResponse(
      res,
      500,
      error.message || "Failed to add product.",
    );
  }
};

export const updateProductById = async (req, res) => {
  try {
    const productId = resolveProductId(req);

    if (!productId) {
      return apiError.errorResponse(res, 400, "Product id is required.");
    }

    const product = await Product.findById(productId);
    if (!product) {
      return apiError.errorResponse(res, 404, "Product not found.");
    }

    const data = req?.body || {};
    const updates = {};

    if (data.name !== undefined) {
      const name = String(data.name || "").trim();
      if (!name) {
        return apiError.errorResponse(res, 400, "Product name cannot be empty.");
      }
      updates.name = name;
    }

    if (data.model !== undefined) {
      const model = String(data.model || "").trim();
      if (!model) {
        return apiError.errorResponse(
          res,
          400,
          "Product model cannot be empty.",
        );
      }
      updates.model = model;
    }

    if (data.oldPrice !== undefined) {
      const oldPrice = Number(data.oldPrice);
      if (!Number.isFinite(oldPrice) || oldPrice < 0) {
        return apiError.errorResponse(
          res,
          400,
          "oldPrice must be a valid non-negative number.",
        );
      }
      updates.oldPrice = oldPrice;
    }

    if (data.newPrice !== undefined) {
      const newPrice = Number(data.newPrice);
      if (!Number.isFinite(newPrice) || newPrice < 0) {
        return apiError.errorResponse(
          res,
          400,
          "newPrice must be a valid non-negative number.",
        );
      }
      updates.newPrice = newPrice;
    }

    const effectiveOldPrice =
      updates.oldPrice !== undefined ? updates.oldPrice : product.oldPrice;
    const effectiveNewPrice =
      updates.newPrice !== undefined ? updates.newPrice : product.newPrice;

    if (
      Number.isFinite(effectiveOldPrice) &&
      Number.isFinite(effectiveNewPrice) &&
      effectiveNewPrice > effectiveOldPrice
    ) {
      return apiError.errorResponse(
        res,
        400,
        "newPrice cannot be greater than oldPrice.",
      );
    }

    if (data.stock !== undefined) {
      const stockInput = String(data.stock ?? "").trim();
      const stock = stockInput === "" ? 0 : Number(stockInput);
      if (!Number.isFinite(stock) || stock < 0) {
        return apiError.errorResponse(
          res,
          400,
          "stock must be a non-negative number.",
        );
      }
      updates.stock = stock;
    }

    if (data.status !== undefined) {
      const status = String(data.status || "")
        .trim()
        .toLowerCase();
      if (!ALLOWED_PRODUCT_STATUSES.has(status)) {
        return apiError.errorResponse(
          res,
          400,
          'status must be one of: "draft", "active", "archived".',
        );
      }
      updates.status = status;
    }

    if (data.isFeatured !== undefined) {
      const isFeatured = parseBoolean(data.isFeatured);
      if (isFeatured === undefined) {
        return apiError.errorResponse(
          res,
          400,
          "isFeatured must be true or false.",
        );
      }
      updates.isFeatured = isFeatured;
    }

    if (data.description !== undefined) {
      const description = String(data.description || "").trim();
      updates.description = description || null;
    }

    if (data.sku !== undefined) {
      const sku = String(data.sku || "")
        .trim()
        .toUpperCase();
      updates.sku = sku || null;
    }

    if (data.brand !== undefined) {
      const brand = String(data.brand || "")
        .trim()
        .toLowerCase();
      updates.brand = brand || null;
    }

    if (data.tags !== undefined) {
      if (typeof data.tags === "string" && !data.tags.trim()) {
        updates.tags = [];
      } else {
        updates.tags = parseTags(data.tags);
      }
    }

    if (data.category !== undefined) {
      if (typeof data.category === "string" && !data.category.trim()) {
        updates.category = [];
      } else {
        updates.category = parseCategory(data.category);
      }
    }

    if (data.specifications !== undefined) {
      if (typeof data.specifications === "string" && !data.specifications.trim()) {
        updates.specifications = [];
      } else {
        const parsedSpecifications = parsePossiblyJson(
          data.specifications,
          "specifications",
        );
        if (!Array.isArray(parsedSpecifications)) {
          return apiError.errorResponse(
            res,
            400,
            "specifications must be an array or a JSON array string.",
          );
        }
        updates.specifications = parsedSpecifications;
      }
    }

    const imageAssets =
      req.files?.image
        ?.map((file) => buildMediaAsset(file, "image"))
        .filter(Boolean) || [];
    const galleryAssets =
      req.files?.gallery
        ?.map((file) => buildMediaAsset(file, "gallery"))
        .filter(Boolean) || [];
    const brochureFile = req.files?.brousher?.[0] || req.files?.brochure?.[0];
    const brochureAsset = brochureFile
      ? buildMediaAsset(brochureFile, "brousher")
      : null;

    const existingMediaAssets = Array.isArray(product.mediaAssets)
      ? product.mediaAssets.map((asset) =>
          typeof asset?.toObject === "function" ? asset.toObject() : asset,
        )
      : [];

    let nextMediaAssets = [...existingMediaAssets];
    const cloudAssetsToDelete = [];

    if (imageAssets.length) {
      const replacedImageAssets = nextMediaAssets.filter(
        (asset) => asset?.assetType === "image",
      );
      cloudAssetsToDelete.push(...replacedImageAssets);

      nextMediaAssets = [
        ...nextMediaAssets.filter((asset) => asset?.assetType !== "image"),
        ...imageAssets,
      ];
      updates.image = imageAssets.map((asset) => asset.url);
    }

    if (galleryAssets.length) {
      const replacedGalleryAssets = nextMediaAssets.filter(
        (asset) => asset?.assetType === "gallery",
      );
      cloudAssetsToDelete.push(...replacedGalleryAssets);

      nextMediaAssets = [
        ...nextMediaAssets.filter((asset) => asset?.assetType !== "gallery"),
        ...galleryAssets,
      ];
      updates.gallery = galleryAssets.map((asset) =>
        asset.resourceType === "video" ? asset.adaptiveUrl || asset.url : asset.url,
      );
    }

    if (brochureAsset) {
      const replacedBrochureAssets = nextMediaAssets.filter(
        (asset) => asset?.assetType === "brousher",
      );
      cloudAssetsToDelete.push(...replacedBrochureAssets);

      nextMediaAssets = [
        ...nextMediaAssets.filter((asset) => asset?.assetType !== "brousher"),
        brochureAsset,
      ];
      updates.brousher = brochureAsset.url;
    }

    if (imageAssets.length || galleryAssets.length || brochureAsset) {
      updates.mediaAssets = nextMediaAssets;
    }

    Object.assign(product, updates);
    await product.save();

    const deletableCloudAssets = cloudAssetsToDelete
      .map((asset) => ({
        publicId: String(asset?.publicId || "").trim(),
        resourceType: asset?.resourceType || getResourceTypeFromUrl(asset?.url) || "image",
      }))
      .filter((asset) => asset.publicId);

    if (deletableCloudAssets.length) {
      await deleteCloudinaryAssets(deletableCloudAssets);
    }

    const updatedProduct = await Product.findById(product._id)
      .populate("category")
      .lean();

    return apiResponse.success(
      res,
      200,
      updatedProduct,
      "Product updated successfully",
    );
  } catch (error) {
    if (error instanceof apiError) {
      return apiError.errorResponse(res, error.statusCode, error.message);
    }

    if (error?.code === 11000) {
      return apiError.errorResponse(
        res,
        409,
        "Product with same name, model or sku already exists.",
      );
    }

    return apiError.errorResponse(
      res,
      500,
      error.message || "Failed to update product.",
    );
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const _id = resolveProductId(req);

    if (!_id) {
      return apiError.errorResponse(res, 400, "Product id is required.");
    }

    const product = await Product.findById(_id);
    if (!product) {
      return apiError.errorResponse(res, 404, "Product not found.");
    }

    const cloudAssets = collectCloudinaryAssetsForDelete(product);
    await deleteCloudinaryAssets(cloudAssets);

    await product.deleteOne();

    return apiResponse.success(
      res,
      200,
      {
        deleted_id: _id,
        deletedCloudAssets: cloudAssets.length,
      },
      "Product and cloud assets deleted successfully",
    );
  } catch (error) {
    return apiError.errorResponse(
      res,
      500,
      error.message || "Failed to delete product.",
    );
  }
};

export const getAlLProduct = async (req, res) => {
  try {
    const result = await Product.find()
      .populate("category")
      .sort({ createdAt: 1 })
      .lean();
    apiResponse.success(res, 200, result, "Data fetched successfully");
  } catch (err) {
    return apiError.errorResponse(res);
  }
};
