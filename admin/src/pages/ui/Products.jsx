import React, { useEffect } from "react";
import useInventoryStore from "../../Store/inventory";
import { ProductForm, ProductTable } from "../../handler";
import { useShallow } from "zustand/react/shallow";

export default function Products() {
  const {
    products,
    categories,
    productForm,
    editingProductId,
    loadingProducts,
    savingProduct,
    deletingProductId,
    error,
    successMessage,
    setProductField,
    startEditProduct,
    cancelEditProduct,
    saveProduct,
    deleteProduct,
    fetchProducts,
    fetchCategories,
    clearFeedback,
    setProductMediaFile,
  } = useInventoryStore(
    useShallow((state) => ({
      products: state.products,
      categories: state.categories,
      productForm: state.productForm,
      editingProductId: state.editingProductId,
      loadingProducts: state.loadingProducts,
      savingProduct: state.savingProduct,
      deletingProductId: state.deletingProductId,
      error: state.error,
      successMessage: state.successMessage,
      setProductField: state.setProductField,
      startEditProduct: state.startEditProduct,
      cancelEditProduct: state.cancelEditProduct,
      saveProduct: state.saveProduct,
      deleteProduct: state.deleteProduct,
      fetchProducts: state.fetchProducts,
      fetchCategories: state.fetchCategories,
      clearFeedback: state.clearFeedback,
      setProductMediaFile: state.setProductMediaFile,
    })),
  );

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await saveProduct();
  };

  const handleDelete = async (product) => {
    const shouldDelete = window.confirm(`Delete product "${product.name}"?`);
    if (!shouldDelete) {
      return;
    }

    await deleteProduct(product._id);
  };

  return (
    <div className="min-h-screen bg-slate-100 pl-24 pr-6 py-6">
      <h1 className="mb-6 rounded-xl bg-yellow-500 p-4 text-center text-2xl font-semibold text-white">
        Product Management
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
        <ProductForm
          form={productForm}
          categories={categories}
          isSaving={savingProduct}
          isEditing={Boolean(editingProductId)}
          onChange={(event) => {
            clearFeedback();
            setProductField(event.target.name, event.target.value);
          }}
          onImageChange={(file) => {
            clearFeedback();
            setProductMediaFile("imageFile", file);
          }}
          onVideoChange={(file) => {
            clearFeedback();
            setProductMediaFile("videoFile", file);
          }}
          onSubmit={handleSubmit}
          onCancel={cancelEditProduct}
        />

        <ProductTable
          products={products}
          loading={loadingProducts}
          deletingProductId={deletingProductId}
          onEdit={startEditProduct}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
