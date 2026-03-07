import React from "react";

const getCategoryText = (categories) => {
  if (!Array.isArray(categories) || !categories.length) {
    return "-";
  }

  return categories
    .map((item) => (typeof item === "string" ? item : item?.name))
    .filter(Boolean)
    .join(", ");
};

export default function ProductTable({
  products,
  loading,
  deletingProductId,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
        Loading products...
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600 shadow-sm">
        No products yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-gray-600">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Model</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Stock</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product._id}>
              <td className="px-4 py-3">{product.name}</td>
              <td className="px-4 py-3">{product.model}</td>
              <td className="px-4 py-3">{getCategoryText(product.category)}</td>
              <td className="px-4 py-3">Rs. {product.newPrice}</td>
              <td className="px-4 py-3">{product.stock ?? 0}</td>
              <td className="px-4 py-3 capitalize">{product.status}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-md border border-blue-200 px-3 py-1 text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product)}
                    disabled={deletingProductId === product._id}
                    className="rounded-md border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingProductId === product._id ? "Deleting..." : "Delete"}
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
