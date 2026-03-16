import React, { useState, useRef } from "react";
import axios from "axios";
import { PaintBucket, Trash2, Plus, X, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateCategoryForm({ onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const clearImage = (e) => {
    e.stopPropagation();
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    if (image) formData.append("image", image);

    try {
      const response = await axios.post("/api/categories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onSuccess?.(response.data);
      setIsOpen(false);
      setName("");
      clearImage(e);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex mt-2 ml-20">
      <motion.div
        layout
        initial={{ borderRadius: "12px" }}
        className="bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden overflow-x-auto"
        style={{ width: isOpen ? "100%" : "auto" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="button"
              layoutId="content"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 font-bold transition-colors whitespace-nowrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Plus size={22} strokeWidth={3} />
              <span>Add New Category</span>
            </motion.button>
          ) : (
            /* EXPANDED ROW FORM STATE */
            <motion.div
              key="form"
              layoutId="content"
              className="p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-6 min-w-max md:min-w-0"
              >
                {/* 1. Name Input */}
                <div className="flex-1">
                  <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1 ml-1">
                    Category Title
                  </p>
                  <input
                    autoFocus
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-800 text-white border border-zinc-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all placeholder:text-zinc-600"
                    placeholder="e.g. Premium Watches"
                  />
                </div>

                {/* 2. Enhanced Image Upload */}
                <div className="flex flex-col">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1 ml-1">
                    Media
                  </p>
                  <div className="flex items-center gap-3 bg-zinc-800 p-2 rounded-xl border border-zinc-700 h-[52px]">
                    <div className="w-9 h-9 bg-zinc-700 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-600 relative">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PaintBucket size={18} className="text-zinc-500" />
                      )}
                    </div>

                    {!image ? (
                      <label className="flex items-center gap-2 px-2 cursor-pointer group">
                        <UploadCloud
                          size={16}
                          className="text-zinc-400 group-hover:text-yellow-500"
                        />
                        <span className="text-sm text-zinc-400 group-hover:text-white">
                          Upload
                        </span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-2 px-2 animate-in fade-in zoom-in duration-300">
                        <span className="text-xs text-green-500 font-medium truncate w-20">
                          Ready!
                        </span>
                        <button
                          type="button"
                          onClick={clearImage}
                          className="p-1 hover:bg-red-500/20 rounded-md transition-colors text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Submit/Cancel Actions */}
                <div className="flex items-center gap-2 self-end mb-[2px]">
                  <button
                    disabled={loading}
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-yellow-500/10 disabled:opacity-50 transition-all active:scale-95"
                  >
                    {loading ? "..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-3 bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-700 hover:text-white transition-all active:scale-95"
                  >
                    <X size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
