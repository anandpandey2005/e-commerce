import { Trash2, Edit3 } from "lucide-react";
import React, { useState } from "react";
import CategoryForm from "../forms/CategoryForm";

export default function CategoryCard(props, onDelete) {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="relative group flex flex-col items-center overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white w-full sm:w-64 md:w-72 lg:w-64 mx-auto">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={toggleEdit}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
          title="Edit Category"
        >
          <Edit3 size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
          title="Delete Category"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="w-full aspect-square overflow-hidden bg-gray-50">
        <img
          src={props.image || "./prPhoto.jpg"}
          alt={props.name || "Category"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="w-full py-3 px-4 text-center bg-yellow-400">
        <h3 className="text-sm md:text-base font-bold text-gray-900 truncate uppercase tracking-wider">
          {props.name || "N/A"}
        </h3>
      </div>

      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
            <button
              onClick={toggleEdit}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Edit Category</h2>
              <CategoryForm
                props={props}
                onSuccess={() => setIsEditing(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
