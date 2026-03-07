import React from "react";

export default function CategoryTable({
  categories,
  loading,
  deletingCategoryId,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
        Loading categories...
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600 shadow-sm">
        No categories yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Id</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="px-4 py-3">{category.name}</td>
              <td className="px-4 py-3 text-gray-500">{category._id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(category)}
                    className="rounded-md border border-blue-200 px-3 py-1 text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(category)}
                    disabled={deletingCategoryId === category._id}
                    className="rounded-md border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingCategoryId === category._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
