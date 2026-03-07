import React from "react";
import FileDropInput from "./FileDropInput";

export default function ProductForm({
  form,
  categories,
  isSaving,
  isEditing,
  onChange,
  onImageChange,
  onVideoChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {isEditing ? "Edit Product" : "Add Product"}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Name
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Model
          <input
            name="model"
            value={form.model}
            onChange={onChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Old Price
          <input
            name="oldPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.oldPrice}
            onChange={onChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          New Price
          <input
            name="newPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.newPrice}
            onChange={onChange}
            required
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Stock
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Status
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          Category
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700">
          SKU
          <input
            name="sku"
            value={form.sku}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700 md:col-span-2">
          Brand
          <input
            name="brand"
            value={form.brand}
            onChange={onChange}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-700 md:col-span-2">
          Tags (comma separated)
          <input
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="electronics, battery"
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>

        <div className="md:col-span-2">
          <FileDropInput
            id="product-image"
            label="Product Image"
            accept="image/*"
            file={form.imageFile}
            existingUrl={form.existingImageUrl}
            helperText="Upload one image (jpg, png, webp)."
            onFileSelect={onImageChange}
          />
        </div>

        <div className="md:col-span-2">
          <FileDropInput
            id="product-video"
            label="Product Video"
            accept="video/mp4,video/webm,video/quicktime"
            file={form.videoFile}
            existingUrl={form.existingVideoUrl}
            helperText="Upload one video file."
            onFileSelect={onVideoChange}
          />
        </div>

        <label className="flex flex-col gap-2 text-sm text-gray-700 md:col-span-2">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={3}
            className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>

        {isEditing ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
