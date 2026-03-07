import React, { useEffect } from "react";
import useInventoryStore from "../../Store/inventory";
import { CategoryForm, CategoryTable } from "../../handler";
import { useShallow } from "zustand/react/shallow";

export default function Categories() {
  const {
    categories,
    categoryForm,
    editingCategoryId,
    loadingCategories,
    savingCategory,
    deletingCategoryId,
    error,
    successMessage,
    setCategoryField,
    startEditCategory,
    cancelEditCategory,
    saveCategory,
    deleteCategory,
    fetchCategories,
    clearFeedback,
  } = useInventoryStore(
    useShallow((state) => ({
    categories: state.categories,
    categoryForm: state.categoryForm,
    editingCategoryId: state.editingCategoryId,
    loadingCategories: state.loadingCategories,
    savingCategory: state.savingCategory,
    deletingCategoryId: state.deletingCategoryId,
    error: state.error,
    successMessage: state.successMessage,
    setCategoryField: state.setCategoryField,
    startEditCategory: state.startEditCategory,
    cancelEditCategory: state.cancelEditCategory,
    saveCategory: state.saveCategory,
    deleteCategory: state.deleteCategory,
    fetchCategories: state.fetchCategories,
    clearFeedback: state.clearFeedback,
    })),
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveCategory();
  };

  const handleDelete = async (category) => {
    const shouldDelete = window.confirm(`Delete category "${category.name}"?`);
    if (!shouldDelete) {
      return;
    }

    await deleteCategory(category._id);
  };

  return (
    <div className="min-h-screen bg-slate-100 pl-24 pr-6 py-6">
      <h1 className="mb-6 rounded-xl bg-yellow-500 p-4 text-center text-2xl font-semibold text-white">
        Category Management
      </h1>

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-6">
        <CategoryForm
          form={categoryForm}
          isSaving={savingCategory}
          isEditing={Boolean(editingCategoryId)}
          onChange={(event) => {
            clearFeedback();
            setCategoryField(event.target.name, event.target.value);
          }}
          onSubmit={handleSubmit}
          onCancel={cancelEditCategory}
        />

        <CategoryTable
          categories={categories}
          loading={loadingCategories}
          deletingCategoryId={deletingCategoryId}
          onEdit={startEditCategory}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
