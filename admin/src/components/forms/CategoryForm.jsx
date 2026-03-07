import React from "react";

export default function CategoryForm({
  form,
  isSaving,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {isEditing ? "Edit Category" : "Add Category"}
      </h2>

      <label className="flex flex-col gap-2 text-sm text-gray-700">
        Category Name
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          required
          className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-yellow-500"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-lg bg-yellow-500 px-4 py-2 font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
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
