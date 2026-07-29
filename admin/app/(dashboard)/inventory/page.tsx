"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useSearch } from "@/hooks/use-search";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  addCategory,
} from "@/redux/slices/catalogSlice";
import {
  setSelectedCategoryId,
  setViewMode,
} from "@/redux/slices/inventorySlice";
import {
  setIsAddProductOpen,
  setIsAddCategoryOpen,
  setSelectedProductId,
  setIsDrawerEditing,
  closeAllModals,
} from "@/redux/slices/uiSlice";
import { IProduct, ICategory, IProductHighlight, IProductSpecification, IProductFAQ } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  Pencil,
  Save,
  X,
  Plus,
  Trash2,
  Camera,
  Upload,
  ImagePlus,
  Star,
  Package,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";

export default function InventoryPage() {
  const dispatch = useAppDispatch();
  const { searchQuery, setSearchQuery } = useSearch();

  // Central Redux State Selectors
  const { products, categories } = useAppSelector((state) => state.catalog);
  const { selectedCategoryId, viewMode } = useAppSelector((state) => state.inventory);
  const { isAddProductOpen, isAddCategoryOpen, selectedProductId, isDrawerEditing } = useAppSelector((state) => state.ui);

  // Derived selected product from Redux store
  const selectedProduct = useMemo(() => {
    return products.find((p) => p._id === selectedProductId) || null;
  }, [products, selectedProductId]);

  // Derived selected category object
  const selectedCategoryObj = useMemo(() => {
    return categories.find((c) => c._id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  // Mounted state for SSR portal rendering
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close all open drawers/modals on Escape key press via Redux action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dispatch(closeAllModals());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const [drawerSuccessMsg, setDrawerSuccessMsg] = useState("");

  // Drawer Edit Form State
  const [drawerForm, setDrawerForm] = useState({
    name: "",
    sku: "",
    brand: "",
    current_price: 0,
    original_price: 0,
    stock: 0,
    description: "",
    thumbnail: "",
    category_name: "",
  });
  
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  // Rich Add Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    brand: "",
    category_id: categories[0]?._id || "",
    current_price: "",
    original_price: "",
    stock: "",
    description: "",
    is_it_featured: false,
    is_active: true,
  });

  // Dynamic Add Product Sub-arrays matching Mongoose schema
  const [productMediaPreviews, setProductMediaPreviews] = useState<string[]>([]);
  const [productHighlights, setProductHighlights] = useState<IProductHighlight[]>([
    { title: "Premium Build Quality", description: "Engineered with precision aerospace materials." },
  ]);
  const [productSpecs, setProductSpecs] = useState<IProductSpecification[]>([
    {
      category_name: "Technical Specs",
      specs: [
        { key: "Warranty", value: "2 Years Limited" },
        { key: "Origin", value: "Imported" },
      ],
    },
  ]);
  const [productFaqs, setProductFaqs] = useState<IProductFAQ[]>([
    { question: "What is included in the package?", answer: "Includes standard accessories and user manual." },
  ]);

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    is_active: true,
  });
  const [categoryMediaPreviews, setCategoryMediaPreviews] = useState<string[]>([]);

  // Open product drawer and sync form via Redux
  const handleOpenProductDrawer = (prod: IProduct) => {
    dispatch(setSelectedProductId(prod._id));
    dispatch(setIsDrawerEditing(false));
    setDrawerSuccessMsg("");
    setDrawerForm({
      name: prod.name,
      sku: prod.sku,
      brand: prod.brand,
      current_price: prod.current_price,
      original_price: prod.original_price,
      stock: prod.stock,
      description: prod.description,
      thumbnail: prod.thumbnail,
      category_name: prod.category_name || "General",
    });
  };

  const handleStartDrawerEdit = () => {
    if (!selectedProduct) return;
    setDrawerForm({
      name: selectedProduct.name,
      sku: selectedProduct.sku,
      brand: selectedProduct.brand,
      current_price: selectedProduct.current_price,
      original_price: selectedProduct.original_price,
      stock: selectedProduct.stock,
      description: selectedProduct.description,
      thumbnail: selectedProduct.thumbnail,
      category_name: selectedProduct.category_name || "General",
    });
    dispatch(setIsDrawerEditing(true));
  };

  // Save drawer inline edits matching Mongoose schema via Redux dispatch
  const handleSaveDrawerEdits = () => {
    if (!selectedProduct) return;

    const currPrice = Number(drawerForm.current_price) || 0;
    const origPrice = Number(drawerForm.original_price) || currPrice;
    const stockQty = Number(drawerForm.stock) || 0;

    const discountPerc = origPrice > currPrice ? Math.round(((origPrice - currPrice) / origPrice) * 100) : 0;
    const stockFlag = stockQty === 0 ? "OUT_OF_STOCK" : stockQty <= 5 ? "LOW_STOCK" : "IN_STOCK";

    const updatedProd: IProduct = {
      ...selectedProduct,
      name: drawerForm.name,
      slug: drawerForm.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      sku: drawerForm.sku,
      brand: drawerForm.brand,
      current_price: currPrice,
      original_price: origPrice,
      discount_percentage: discountPerc,
      stock: stockQty,
      is_in_stock: stockQty > 0,
      stock_availabilty_flag: stockFlag,
      description: drawerForm.description,
      thumbnail: drawerForm.thumbnail,
      media: [
        {
          public_id: `img_${Date.now()}`,
          secure_url: drawerForm.thumbnail,
          resource_type: "image",
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateProduct(updatedProd));
    dispatch(setIsDrawerEditing(false));
    setDrawerSuccessMsg("All changes saved successfully to Redux Toolkit store!");
    setTimeout(() => setDrawerSuccessMsg(""), 3500);
  };

  // Category counts computation from Redux store
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Clean filtered products list based on search and category selection from Redux store
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategoryId === "all" || p.category_id === selectedCategoryId;

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.category_name && p.category_name.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  // Handle Product CRUD Actions via Redux dispatch
  const handleToggleProductStatus = (productId: string) => {
    dispatch(toggleProductStatus(productId));
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product from Redux inventory store?")) {
      dispatch(deleteProduct(productId));
      dispatch(setSelectedProductId(null));
    }
  };

  // File Upload Previews Handler
  const handleProductFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setProductMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleCategoryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setCategoryMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Sub-item Handlers for Add Product Form
  const handleAddHighlightField = () => {
    setProductHighlights([...productHighlights, { title: "", description: "" }]);
  };

  const handleRemoveHighlightField = (index: number) => {
    setProductHighlights(productHighlights.filter((_, idx) => idx !== index));
  };

  // Submit Handler for Slide-Over Add Product via Redux Toolkit dispatch
  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.sku || !productForm.current_price) return;

    const currPrice = parseFloat(productForm.current_price) || 0;
    const origPrice = parseFloat(productForm.original_price) || currPrice;
    const stockQty = parseInt(productForm.stock) || 0;

    const catObj = categories.find((c) => c._id === productForm.category_id);

    const thumbUrl =
      productMediaPreviews[0] ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800";

    const newProd: IProduct = {
      _id: `prd_${Date.now()}`,
      name: productForm.name,
      slug: productForm.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      description: productForm.description || "Product overview description.",
      original_price: origPrice,
      current_price: currPrice,
      discount_percentage:
        origPrice > currPrice ? Math.round(((origPrice - currPrice) / origPrice) * 100) : 0,
      sku: productForm.sku,
      stock: stockQty,
      is_in_stock: stockQty > 0,
      is_it_featured: productForm.is_it_featured,
      category_id: productForm.category_id,
      category_name: catObj?.name || "General",
      brand: productForm.brand || "Apex",
      media: productMediaPreviews.length
        ? productMediaPreviews.map((url, i) => ({
            public_id: `img_${Date.now()}_${i}`,
            secure_url: url,
            resource_type: "image",
          }))
        : [{ public_id: `img_${Date.now()}`, secure_url: thumbUrl, resource_type: "image" }],
      thumbnail: thumbUrl,
      highlights: productHighlights.filter((h) => h.title.trim() !== ""),
      specifications: productSpecs,
      faqs: productFaqs.filter((f) => f.question.trim() !== ""),
      ratings: { average: 5.0, count: 0 },
      stock_availabilty_flag: stockQty === 0 ? "OUT_OF_STOCK" : stockQty <= 5 ? "LOW_STOCK" : "IN_STOCK",
      is_active: productForm.is_active,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addProduct(newProd));
    dispatch(setIsAddProductOpen(false));
    setProductForm({
      name: "",
      sku: "",
      brand: "",
      category_id: categories[0]?._id || "",
      current_price: "",
      original_price: "",
      stock: "",
      description: "",
      is_it_featured: false,
      is_active: true,
    });
    setProductMediaPreviews([]);
  };

  // Submit Handler for Slide-Over Add Category via Redux Toolkit dispatch
  const handleCreateCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) return;

    const thumbUrl =
      categoryMediaPreviews[0] ||
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&q=80&w=600";

    const newCat: ICategory = {
      _id: `cat_${Date.now()}`,
      name: categoryForm.name,
      slug: categoryForm.name.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-"),
      description: categoryForm.description || "Category description.",
      media: [
        {
          public_id: `cat_img_${Date.now()}`,
          secure_url: thumbUrl,
          resource_type: "image",
        },
      ],
      is_active: categoryForm.is_active,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addCategory(newCat));
    dispatch(setIsAddCategoryOpen(false));
    setCategoryForm({ name: "", description: "", is_active: true });
    setCategoryMediaPreviews([]);
  };

  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    dispatch(updateProduct(editingProduct));
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8 font-hanken">
      {/* 1. Header Banner & Quick Metrics */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 mb-2 rounded-full text-[10px] font-geist font-bold tracking-widest uppercase bg-orange-500/15 text-orange-400 border border-orange-500/30">
            <Sparkles className="w-3 h-3 mr-1" /> Enterprise Warehouse & Redux Central Store
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Stock Catalog & Category Hub
          </h1>
          <p className="text-xs text-[#8e9192] font-geist mt-1 max-w-xl">
            Manage product catalog, inventory stock levels, categories, and search SKUs with <kbd className="px-1.5 py-0.5 rounded bg-[#262626] border border-[#333] text-[10px]">Shift + S</kbd>.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => dispatch(setIsAddCategoryOpen(true))}
            className="flex items-center px-4 py-2.5 rounded-2xl bg-[#262626] hover:bg-[#333333] text-white font-geist font-bold text-xs border border-[#383838] transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Category
          </button>

          <button
            onClick={() => dispatch(setIsAddProductOpen(true))}
            className="flex items-center px-5 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-black font-hanken font-extrabold text-xs transition-all shadow-lg cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Product
          </button>
        </div>
      </div>

      {/* 2. TOP CLEAN STAT CARDS (Sourced directly from Redux Toolkit) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: In Stock Items */}
        <div className="p-5 rounded-2xl bg-[#1b1b1b] border border-[#262626] hover:border-[#383838] transition-all">
          <div className="text-[11px] font-geist text-[#8e9192] uppercase font-semibold">In Stock Items</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 mt-1">
            {products.filter((p) => p.is_in_stock).length}
          </div>
        </div>

        {/* KPI 2: Low Stock Alert */}
        <div className="p-5 rounded-2xl bg-[#1b1b1b] border border-[#262626] hover:border-[#383838] transition-all">
          <div className="text-[11px] font-geist text-[#8e9192] uppercase font-semibold">Low Stock Alert</div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">
            {products.filter((p) => p.stock_availabilty_flag === "LOW_STOCK" || p.stock_availabilty_flag === "OUT_OF_STOCK").length}
          </div>
        </div>

        {/* KPI 3: Categories */}
        <div className="p-5 rounded-2xl bg-[#1b1b1b] border border-[#262626] hover:border-[#383838] transition-all">
          <div className="text-[11px] font-geist text-[#8e9192] uppercase font-semibold">Categories</div>
          <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-1">{categories.length}</div>
        </div>
      </div>

      {/* 3. Clean View Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1b1b1b] border border-[#262626] flex items-center justify-between">
        <div className="text-xs font-geist text-[#8e9192]">
          {searchQuery ? (
            <span>Search results for: <strong className="text-orange-400 font-bold">"{searchQuery}"</strong></span>
          ) : (
            <span>Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> products</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center rounded-xl bg-[#131313] p-1 border border-[#262626]">
            <button
              onClick={() => dispatch(setViewMode("list"))}
              className={cn(
                "px-3 py-1 text-[11px] font-geist font-semibold rounded-lg transition-colors cursor-pointer",
                viewMode === "list" ? "bg-[#262626] text-white" : "text-[#8e9192] hover:text-white"
              )}
            >
              List View
            </button>
            <button
              onClick={() => dispatch(setViewMode("grid"))}
              className={cn(
                "px-3 py-1 text-[11px] font-geist font-semibold rounded-lg transition-colors cursor-pointer",
                viewMode === "grid" ? "bg-[#262626] text-white" : "text-[#8e9192] hover:text-white"
              )}
            >
              Grid Cards
            </button>
          </div>
        </div>
      </div>

      {/* 4. PARALLEL ADJACENT LAYOUT (Categories Panel Left + Products List/Grid Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Categories Parallel Sidebar */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-[#1b1b1b] border border-[#262626] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
            <h2 className="text-sm font-extrabold text-white tracking-wide font-geist uppercase text-orange-400 flex items-center">
              <Layers className="w-4 h-4 mr-1.5" /> Categories ({categories.length})
            </h2>
          </div>

          {/* Categories List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {/* All Categories Option */}
            <button
              onClick={() => dispatch(setSelectedCategoryId("all"))}
              className={cn(
                "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group",
                selectedCategoryId === "all"
                  ? "bg-orange-500/15 border-orange-500/50 text-orange-300 shadow-md font-bold"
                  : "bg-[#131313] border-[#262626] text-[#c4c7c8] hover:bg-[#222222] hover:text-white"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-colors",
                  selectedCategoryId === "all" ? "bg-orange-500 text-black font-extrabold" : "bg-orange-500/20 text-orange-400"
                )}>
                  ALL
                </div>
                <div>
                  <div className="text-xs font-bold font-hanken">All Products Catalog</div>
                  <div className="text-[10px] font-geist text-[#8e9192]">Full Inventory List</div>
                </div>
              </div>
              
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-geist font-extrabold transition-colors shrink-0",
                  selectedCategoryId === "all" ? "bg-orange-500 text-black" : "bg-[#262626] text-white"
                )}
              >
                {products.length}
              </span>
            </button>

            {/* List of Categories */}
            {categories.map((cat) => {
              const count = categoryCounts[cat._id] || 0;
              const isSelected = selectedCategoryId === cat._id;
              const thumbUrl = cat.media[0]?.secure_url;

              return (
                <button
                  key={cat._id}
                  onClick={() => dispatch(setSelectedCategoryId(cat._id))}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer group relative",
                    isSelected
                      ? "bg-orange-500/15 border-orange-500/50 text-orange-300 shadow-md font-bold"
                      : "bg-[#131313] border-[#262626] text-[#c4c7c8] hover:bg-[#222222] hover:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={cat.name}
                        className="w-9 h-9 rounded-xl object-cover border border-[#262626] shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-[#262626] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold font-hanken truncate group-hover:text-white transition-colors">{cat.name}</div>
                      <div className="text-[10px] font-geist text-[#8e9192] truncate">{cat.description}</div>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-geist font-extrabold transition-colors shrink-0",
                      isSelected ? "bg-orange-500 text-black font-extrabold" : "bg-[#262626] text-[#e2e2e2]"
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Products List & Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Category Header Bar in Products Column */}
          {selectedCategoryId !== "all" && selectedCategoryObj && (
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="p-2 rounded-xl bg-orange-500/20 text-orange-400 font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-geist">
                    Category: {selectedCategoryObj.name}
                  </h3>
                  <p className="text-[10px] text-[#8e9192] font-geist">
                    Showing {filteredProducts.length} products under {selectedCategoryObj.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(setSelectedCategoryId("all"))}
                className="px-3 py-1.5 rounded-xl bg-[#262626] hover:bg-[#333] text-white font-geist font-bold text-[11px] cursor-pointer"
              >
                Show All Categories
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#1b1b1b] border border-[#262626] space-y-3">
              <Package className="w-10 h-10 text-orange-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No products found</h3>
              <p className="text-xs text-[#8e9192] font-geist max-w-sm mx-auto">
                No matching product inventory found for selected category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  dispatch(setSelectedCategoryId("all"));
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 text-black font-geist font-bold text-xs cursor-pointer"
              >
                Show All Products
              </button>
            </div>
          ) : viewMode === "list" ? (
            /* Table View */
            <div className="p-6 rounded-3xl bg-[#1b1b1b] border border-[#262626] shadow-md overflow-x-auto">
              <table className="w-full text-left text-xs text-[#c4c7c8]">
                <thead className="text-[11px] font-geist uppercase tracking-widest text-[#8e9192] bg-[#0e0e0e] border-b border-[#262626]">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Product</th>
                    <th className="py-3.5 px-4 font-semibold">SKU</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Price</th>
                    <th className="py-3.5 px-4 font-semibold">Stock</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {filteredProducts.map((prod) => (
                    <tr
                      key={prod._id}
                      onClick={() => handleOpenProductDrawer(prod)}
                      className="hover:bg-[#252525] transition-colors cursor-pointer group"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.thumbnail}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#333] shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">
                              {prod.name}
                            </div>
                            <div className="text-[10px] font-geist text-[#8e9192] flex items-center space-x-2">
                              <span>Brand: {prod.brand}</span>
                              {prod.is_it_featured && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 flex items-center">
                                  <Star className="w-2.5 h-2.5 mr-0.5 fill-amber-300" /> Featured
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-geist font-bold text-indigo-400">
                        {prod.sku}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-geist text-[#8e9192]">
                        {prod.category_name || "General"}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-geist">
                        <div className="font-bold text-white">{formatCurrency(prod.current_price)}</div>
                        {prod.original_price > prod.current_price && (
                          <div className="text-[10px] text-[#8e9192] line-through">
                            {formatCurrency(prod.original_price)}
                          </div>
                        )}
                      </td>

                      {/* Stock Quantity */}
                      <td className="py-3.5 px-4 font-geist font-bold text-white">
                        {prod.stock} units
                      </td>

                      {/* Stock Availability Flag */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-geist font-bold border",
                            prod.stock_availabilty_flag === "OUT_OF_STOCK"
                              ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              : prod.stock_availabilty_flag === "LOW_STOCK"
                              ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          )}
                        >
                          {prod.stock_availabilty_flag}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod._id}
                  onClick={() => handleOpenProductDrawer(prod)}
                  className="p-5 rounded-3xl bg-[#1b1b1b] border border-[#262626] hover:border-[#444] transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-[#131313] border border-[#262626]">
                      <img
                        src={prod.thumbnail}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-geist font-bold bg-black/70 text-white backdrop-blur-md">
                        {prod.sku}
                      </span>
                    </div>

                    <div className="text-[11px] font-geist font-semibold text-orange-400">
                      {prod.brand} • {prod.category_name}
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors mt-1 line-clamp-2">
                      {prod.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#262626] flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-white">
                        {formatCurrency(prod.current_price)}
                      </div>
                      <div className="text-[10px] font-geist text-[#8e9192]">
                        Stock: {prod.stock} units
                      </div>
                    </div>

                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-geist font-bold border",
                        prod.stock_availabilty_flag === "OUT_OF_STOCK"
                          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                          : prod.stock_availabilty_flag === "LOW_STOCK"
                          ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                      )}
                    >
                      {prod.stock_availabilty_flag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PORTAL RENDERED DRAWERS (Appended to document.body) */}
      {mounted &&
        createPortal(
          <>
            {/* 5. RICH PRODUCT DETAILS & INLINE-EDIT DRAWER */}
            {selectedProduct && (
              <div
                className="fixed inset-0 z-[1000] flex justify-end bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) dispatch(setSelectedProductId(null));
                }}
              >
                <div className="w-full max-w-2xl bg-[#181818] border-l border-[#2e2e2e] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between text-white font-hanken">
                  <div className="space-y-6">
                    
                    {/* Prominent High-Contrast Drawer Header Bar */}
                    <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4 pt-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-geist font-bold uppercase tracking-widest bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          {selectedProduct.category_name || "Catalog Product"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-geist font-semibold bg-[#262626] text-[#c4c7c8]">
                          SKU: {selectedProduct.sku}
                        </span>

                        <button
                          onClick={() => {
                            if (!isDrawerEditing) handleStartDrawerEdit();
                            else dispatch(setIsDrawerEditing(false));
                          }}
                          className={cn(
                            "flex items-center px-3 py-1 rounded-full text-[10px] font-geist font-bold border transition-colors cursor-pointer ml-2",
                            isDrawerEditing
                              ? "bg-amber-500 text-black border-amber-400 font-extrabold"
                              : "bg-[#262626] text-white border-[#383838] hover:bg-[#333]"
                          )}
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          {isDrawerEditing ? "Cancel Editing" : "Quick Edit Mode"}
                        </button>
                      </div>

                      {/* Close Button */}
                      <button
                        onClick={() => dispatch(setSelectedProductId(null))}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-geist font-bold text-xs hover:bg-[#e2e2e2] shadow-xl transition-all active:scale-95 cursor-pointer shrink-0"
                      >
                        <X className="w-4 h-4" />
                        <span>Close</span>
                      </button>
                    </div>

                    {/* Success Notification Banner */}
                    {drawerSuccessMsg && (
                      <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-geist font-bold flex items-center justify-center space-x-2 animate-in fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{drawerSuccessMsg}</span>
                      </div>
                    )}

                    {/* VIEW vs DIRECT EDIT MODE */}
                    {!isDrawerEditing ? (
                      /* READ-ONLY RICH DETAILS VIEW */
                      <>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                            {selectedProduct.name}
                          </h2>
                          <div className="text-xs text-[#8e9192] font-geist mt-1 flex items-center justify-between">
                            <span>Brand: <strong className="text-white">{selectedProduct.brand}</strong></span>
                            <span className="text-[11px] text-orange-400 font-semibold cursor-pointer hover:underline flex items-center" onClick={handleStartDrawerEdit}>
                              <Pencil className="w-3 h-3 mr-1" /> Click anywhere to edit details & photo
                            </span>
                          </div>
                        </div>

                        {/* Main Image Gallery */}
                        <div className="space-y-2">
                          <div
                            onClick={handleStartDrawerEdit}
                            className="aspect-video rounded-3xl overflow-hidden bg-[#131313] border border-[#2a2a2a] relative group cursor-pointer"
                            title="Click photo to edit image URL"
                          >
                            <img
                              src={selectedProduct.thumbnail || selectedProduct.media[0]?.secure_url}
                              alt={selectedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-geist font-bold text-white backdrop-blur-xs">
                              <Camera className="w-4 h-4 mr-1.5" /> Click to change product image
                            </div>
                            <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[10px] font-geist bg-black/80 text-white backdrop-blur-md font-semibold flex items-center">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-1" /> {selectedProduct.ratings?.average || 5.0} ({selectedProduct.ratings?.count || 0} reviews)
                            </span>
                          </div>
                        </div>

                        {/* Pricing & Stock Details Box */}
                        <div
                          onClick={handleStartDrawerEdit}
                          className="p-5 rounded-2xl bg-[#131313] border border-[#2a2a2a] flex items-center justify-between cursor-pointer hover:border-orange-500/50 transition-colors"
                        >
                          <div>
                            <div className="text-[10px] font-geist text-[#8e9192] uppercase font-semibold">Pricing</div>
                            <div className="flex items-baseline space-x-2 mt-0.5">
                              <span className="text-2xl font-extrabold text-white">
                                {formatCurrency(selectedProduct.current_price)}
                              </span>
                              {selectedProduct.original_price > selectedProduct.current_price && (
                                <span className="text-xs text-[#8e9192] line-through font-geist">
                                  {formatCurrency(selectedProduct.original_price)}
                                </span>
                              )}
                              {selectedProduct.discount_percentage ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-geist font-bold bg-emerald-500/20 text-emerald-400">
                                  {selectedProduct.discount_percentage}% OFF
                                </span>
                              ) : null}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[10px] font-geist text-[#8e9192] uppercase font-semibold">Warehouse Stock</div>
                            <div className="text-sm font-bold text-white mt-1">
                              {selectedProduct.stock} units available
                            </div>
                            <span
                              className={cn(
                                "inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-geist font-bold border",
                                selectedProduct.stock_availabilty_flag === "OUT_OF_STOCK"
                                  ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                                  : selectedProduct.stock_availabilty_flag === "LOW_STOCK"
                                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                              )}
                            >
                              {selectedProduct.stock_availabilty_flag}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                          <h3 className="text-xs font-bold font-geist uppercase text-[#8e9192] tracking-wider">
                            Product Overview & Description
                          </h3>
                          <p
                            onClick={handleStartDrawerEdit}
                            className="text-xs text-[#c4c7c8] leading-relaxed bg-[#131313] p-4 rounded-2xl border border-[#2a2a2a] cursor-pointer hover:border-orange-500/40 transition-colors"
                          >
                            {selectedProduct.description}
                          </p>
                        </div>
                      </>
                    ) : (
                      /* INTERACTIVE INLINE DIRECT EDIT FORM IN DRAWER */
                      <div className="space-y-5 animate-in fade-in">
                        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-geist font-bold flex items-center space-x-2">
                          <Pencil className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>Quick Edit Mode active. Modify attributes below and click "Save & Apply Changes".</span>
                        </div>

                        {/* Product Image URL Input & Preview */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold font-geist uppercase text-orange-400">
                            Product Photo / Image URL
                          </label>
                          <div className="flex items-center space-x-3">
                            <img
                              src={drawerForm.thumbnail}
                              alt="Preview"
                              className="w-14 h-14 rounded-2xl object-cover border border-[#333] shrink-0"
                            />
                            <input
                              type="text"
                              value={drawerForm.thumbnail}
                              onChange={(e) => setDrawerForm({ ...drawerForm, thumbnail: e.target.value })}
                              placeholder="Paste image URL here..."
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 font-geist"
                            />
                          </div>
                        </div>

                        {/* Name & SKU */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Product Title</label>
                            <input
                              type="text"
                              value={drawerForm.name}
                              onChange={(e) => setDrawerForm({ ...drawerForm, name: e.target.value })}
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-geist text-[#8e9192] mb-1">SKU Code</label>
                            <input
                              type="text"
                              value={drawerForm.sku}
                              onChange={(e) => setDrawerForm({ ...drawerForm, sku: e.target.value })}
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* Brand & Prices */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Brand</label>
                            <input
                              type="text"
                              value={drawerForm.brand}
                              onChange={(e) => setDrawerForm({ ...drawerForm, brand: e.target.value })}
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Current Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={drawerForm.current_price}
                              onChange={(e) => setDrawerForm({ ...drawerForm, current_price: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Original Price ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={drawerForm.original_price}
                              onChange={(e) => setDrawerForm({ ...drawerForm, original_price: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>

                        {/* Stock Units */}
                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Stock Quantity (Units)</label>
                          <input
                            type="number"
                            value={drawerForm.stock}
                            onChange={(e) => setDrawerForm({ ...drawerForm, stock: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Overview Description</label>
                          <textarea
                            rows={4}
                            value={drawerForm.description}
                            onChange={(e) => setDrawerForm({ ...drawerForm, description: e.target.value })}
                            className="w-full bg-[#131313] border border-[#333] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Action Toolbar */}
                  <div className="pt-6 mt-6 border-t border-[#2a2a2a] flex items-center justify-between gap-3">
                    {isDrawerEditing ? (
                      <>
                        <button
                          onClick={() => dispatch(setIsDrawerEditing(false))}
                          className="px-4 py-2.5 rounded-xl bg-[#262626] text-white font-geist font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleSaveDrawerEdits}
                          className="flex items-center px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-hanken font-extrabold text-xs cursor-pointer transition-colors shadow-lg"
                        >
                          <Save className="w-4 h-4 mr-1.5" /> Save & Apply Changes
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleToggleProductStatus(selectedProduct._id)}
                          className={cn(
                            "px-4 py-2.5 rounded-xl font-geist font-bold text-xs transition-colors cursor-pointer border",
                            selectedProduct.is_active
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30"
                          )}
                        >
                          {selectedProduct.is_active ? "Deactivate Product" : "Activate Product"}
                        </button>

                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDeleteProduct(selectedProduct._id)}
                            className="flex items-center px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-geist font-bold text-xs cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                          </button>

                          <button
                            onClick={handleStartDrawerEdit}
                            className="flex items-center px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-hanken font-extrabold text-xs cursor-pointer transition-colors shadow-lg"
                          >
                            <Pencil className="w-4 h-4 mr-1.5" /> Edit Details
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 6. SLIDE-OVER ADD PRODUCT DRAWER */}
            {isAddProductOpen && (
              <div
                className="fixed inset-0 z-[1000] flex justify-end bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) dispatch(setIsAddProductOpen(false));
                }}
              >
                <div className="w-full max-w-2xl bg-[#181818] border-l border-[#2e2e2e] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between text-white font-hanken">
                  <div className="space-y-6">
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                      <div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-geist font-bold uppercase tracking-widest bg-orange-500/20 text-orange-300 border border-orange-500/30">
                          Product Catalog Creator
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                          Add New Product Inventory
                        </h2>
                      </div>

                      <button
                        onClick={() => dispatch(setIsAddProductOpen(false))}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white text-black font-geist font-bold text-xs hover:bg-[#e2e2e2] shadow-xl transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Close</span>
                      </button>
                    </div>

                    <form onSubmit={handleCreateProductSubmit} className="space-y-6 text-xs">
                      {/* Multipart Drag-and-Drop Image Uploader */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-orange-400 font-geist">
                          Product Media & Photo Upload (Multipart)
                        </label>
                        
                        <div className="border-2 border-dashed border-[#333] hover:border-orange-500/60 rounded-3xl p-6 text-center bg-[#131313] transition-colors relative cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleProductFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-8 h-8 text-orange-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                          <div className="text-xs font-bold text-white font-geist">
                            Drag & Drop product images here or <span className="text-orange-400 underline">Browse Files</span>
                          </div>
                          <div className="text-[10px] text-[#8e9192] font-geist mt-1">
                            Supports JPG, PNG, WEBP up to 10MB each (Cloudinary ready)
                          </div>
                        </div>

                        {/* Previews List */}
                        {productMediaPreviews.length > 0 && (
                          <div className="flex items-center space-x-3 overflow-x-auto pt-2 pb-1">
                            {productMediaPreviews.map((url, idx) => (
                              <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#333] shrink-0 group">
                                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setProductMediaPreviews(productMediaPreviews.filter((_, i) => i !== idx))}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* General Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Product Title *</label>
                          <input
                            type="text"
                            required
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            placeholder="e.g. Wireless Studio Headphones"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">SKU Code *</label>
                          <input
                            type="text"
                            required
                            value={productForm.sku}
                            onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                            placeholder="e.g. AUDIO-STUDIO-01"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Brand Name</label>
                          <input
                            type="text"
                            value={productForm.brand}
                            onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                            placeholder="e.g. AeroSound"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Category *</label>
                          <select
                            value={productForm.category_id}
                            onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          >
                            {categories.map((c) => (
                              <option key={c._id} value={c._id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Current Price ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={productForm.current_price}
                            onChange={(e) => setProductForm({ ...productForm, current_price: e.target.value })}
                            placeholder="299.99"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Original Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={productForm.original_price}
                            onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                            placeholder="349.99"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Stock Units *</label>
                          <input
                            type="number"
                            required
                            value={productForm.stock}
                            onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                            placeholder="25"
                            className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Product Description</label>
                        <textarea
                          rows={3}
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          placeholder="Full product overview, material specs..."
                          className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-orange-500 font-medium"
                        />
                      </div>

                      {/* Key Highlights Section Builder */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase text-orange-400 font-geist">
                            Key Highlights & Feature Badges
                          </label>
                          <button
                            type="button"
                            onClick={handleAddHighlightField}
                            className="text-[11px] font-geist font-bold text-orange-400 hover:underline flex items-center"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Highlight Feature
                          </button>
                        </div>

                        <div className="space-y-2">
                          {productHighlights.map((hl, idx) => (
                            <div key={idx} className="flex items-center space-x-2 p-3 rounded-2xl bg-[#131313] border border-[#262626]">
                              <input
                                type="text"
                                value={hl.title}
                                onChange={(e) => {
                                  const updated = [...productHighlights];
                                  updated[idx].title = e.target.value;
                                  setProductHighlights(updated);
                                }}
                                placeholder="Title (e.g. Active ANC 3.0)"
                                className="w-1/3 bg-[#1b1b1b] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={hl.description}
                                onChange={(e) => {
                                  const updated = [...productHighlights];
                                  updated[idx].description = e.target.value;
                                  setProductHighlights(updated);
                                }}
                                placeholder="Description details..."
                                className="flex-1 bg-[#1b1b1b] border border-[#333] rounded-lg px-2.5 py-1.5 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveHighlightField(idx)}
                                className="text-[#8e9192] hover:text-rose-400 p-1"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Form Footer Controls */}
                      <div className="pt-6 border-t border-[#262626] flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => dispatch(setIsAddProductOpen(false))}
                          className="px-4 py-2.5 rounded-xl bg-[#262626] text-white font-geist font-bold text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-hanken font-extrabold text-xs shadow-lg cursor-pointer flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create & Save Product
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SLIDE-OVER ADD CATEGORY DRAWER */}
            {isAddCategoryOpen && (
              <div
                className="fixed inset-0 z-[1000] flex justify-end bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
                onClick={(e) => {
                  if (e.target === e.currentTarget) dispatch(setIsAddCategoryOpen(false));
                }}
              >
                <div className="w-full max-w-md bg-[#181818] border-l border-[#2e2e2e] h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between text-white font-hanken">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-[#2a2a2a] pb-4">
                      <div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-geist font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          Category Builder
                        </span>
                        <h2 className="text-xl font-extrabold text-white mt-1">Add New Category</h2>
                      </div>

                      <button
                        onClick={() => dispatch(setIsAddCategoryOpen(false))}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white text-black font-geist font-bold text-xs hover:bg-[#e2e2e2] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Close</span>
                      </button>
                    </div>

                    <form onSubmit={handleCreateCategorySubmit} className="space-y-5 text-xs">
                      {/* Category File Upload */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase text-indigo-400 font-geist">
                          Category Banner Photo Upload
                        </label>
                        <div className="border-2 border-dashed border-[#333] hover:border-indigo-500/60 rounded-2xl p-5 text-center bg-[#131313] transition-colors relative cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategoryFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <ImagePlus className="w-8 h-8 text-indigo-400 mx-auto mb-1" />
                          <div className="text-xs font-bold text-[#e2e2e2] font-geist">
                            Upload category cover image
                          </div>
                        </div>

                        {categoryMediaPreviews.length > 0 && (
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#333] mt-2">
                            <img src={categoryMediaPreviews[0]} alt="Category preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Category Name *</label>
                        <input
                          type="text"
                          required
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                          placeholder="e.g. Smart Home Acoustics"
                          className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-geist text-[#8e9192] mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                          placeholder="Category overview and classification..."
                          className="w-full bg-[#131313] border border-[#262626] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 font-medium"
                        />
                      </div>

                      <div className="pt-4 border-t border-[#262626] flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => dispatch(setIsAddCategoryOpen(false))}
                          className="px-4 py-2 rounded-xl bg-[#262626] text-white font-geist font-bold text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-hanken font-bold text-xs"
                        >
                          <Plus className="w-4 h-4 mr-1.5" /> Create Category
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>,
          document.body
        )}
    </div>
  );
}
