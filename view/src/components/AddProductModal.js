import React, { useState, useEffect } from "react";

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');

const AddProductModal = ({ onAdd, onUpdate, onClose, categories, product, loading }) => {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    brand: "",
    priceAmount: "",
    priceCurrency: "USD",
    images: [""],
    category: "",
    material: "",
    style: "",
    dimensions: { height: "", width: "", depth: "" },
    weight: "",
    colors: [""],
    assemblyRequired: false,
    stock: "",
    tags: [""],
    isActive: true,
  });

  // Initialize form when product prop changes
  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || "",
        slug: product.slug || "",
        description: product.description || "",
        brand: product.brand || "",
        priceAmount: product.price?.amount?.toString() || "",
        priceCurrency: product.price?.currency || "USD",
        images: product.images?.length ? [...product.images] : [""],
        category: product.category?._id || product.category || "",
        material: product.material || "",
        style: product.style || "",
        dimensions: product.dimensions || { height: "", width: "", depth: "" },
        weight: product.weight?.toString() || "",
        colors: product.colors?.length ? [...product.colors] : [""],
        assemblyRequired: product.assemblyRequired || false,
        stock: product.stock?.toString() || "0",
        tags: product.tags?.length ? [...product.tags] : [""],
        isActive: product.isActive ?? true,
      });
    } else {
      // Reset form for new product
      setForm({
        title: "",
        slug: "",
        description: "",
        brand: "",
        priceAmount: "",
        priceCurrency: "USD",
        images: [""],
        category: "",
        material: "",
        style: "",
        dimensions: { height: "", width: "", depth: "" },
        weight: "",
        colors: [""],
        assemblyRequired: false,
        stock: "",
        tags: [""],
        isActive: true,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "title" && !product && { slug: slugify(value) })
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (index, e, arrayName) => {
    const newArray = [...form[arrayName]];
    newArray[index] = e.target.value;
    setForm(prev => ({
      ...prev,
      [arrayName]: newArray,
    }));
  };

  const addArrayField = (arrayName) => {
    setForm(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }));
  };

  const removeArrayField = (index, arrayName) => {
    const newArray = [...form[arrayName]];
    newArray.splice(index, 1);
    setForm(prev => ({
      ...prev,
      [arrayName]: newArray.length ? newArray : [""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.priceAmount || !form.category) {
      alert("Please fill required fields: Title, Price, Category");
      return;
    }

    const productData = {
      title: form.title.trim(),
      slug: form.slug || slugify(form.title),
      description: form.description.trim(),
      brand: form.brand.trim(),
      price: {
        amount: parseFloat(form.priceAmount),
        currency: form.priceCurrency,
      },
      images: form.images.filter(img => img.trim() !== ""),
      category: form.category,
      material: form.material.trim(),
      style: form.style.trim(),
      dimensions: {
        height: parseFloat(form.dimensions.height) || 0,
        width: parseFloat(form.dimensions.width) || 0,
        depth: parseFloat(form.dimensions.depth) || 0,
      },
      weight: parseFloat(form.weight) || 0,
      colors: form.colors.filter(c => c.trim() !== ""),
      assemblyRequired: form.assemblyRequired,
      stock: parseInt(form.stock) || 0,
      tags: form.tags.filter(t => t.trim() !== ""),
      isActive: form.isActive,
    };

    try {
      if (product) {
        await onUpdate(product._id, productData);
      } else {
        await onAdd(productData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message || "Failed to save product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            disabled={loading}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Category*</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Price*</label>
                <div className="flex rounded-md shadow-sm">
                  <select
                    name="priceCurrency"
                    value={form.priceCurrency}
                    onChange={handleChange}
                    className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="INR">INR</option>
                  </select>
                  <input
                    type="number"
                    name="priceAmount"
                    min="0"
                    step="0.01"
                    value={form.priceAmount}
                    onChange={handleChange}
                    required
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
            <div className="space-y-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={img}
                    onChange={(e) => handleArrayChange(idx, e, "images")}
                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField(idx, "images")}
                    disabled={form.images.length === 1}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField("images")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Image
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Material</label>
                <input
                  type="text"
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Style</label>
                <input
                  type="text"
                  name="style"
                  value={form.style}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  step="0.01"
                  value={form.weight}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Dimensions (cm)</label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Height</label>
                    <input
                      type="number"
                      name="height"
                      min="0"
                      step="0.01"
                      value={form.dimensions.height}
                      onChange={handleDimensionChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Width</label>
                    <input
                      type="number"
                      name="width"
                      min="0"
                      step="0.01"
                      value={form.dimensions.width}
                      onChange={handleDimensionChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Depth</label>
                    <input
                      type="number"
                      name="depth"
                      min="0"
                      step="0.01"
                      value={form.dimensions.depth}
                      onChange={handleDimensionChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Colors & Tags Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Colors</h3>
              <div className="space-y-3">
                {form.colors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Color"
                      value={color}
                      onChange={(e) => handleArrayChange(idx, e, "colors")}
                      className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(idx, "colors")}
                      disabled={form.colors.length === 1}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("colors")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Color
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
              <div className="space-y-3">
                {form.tags.map((tag, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Tag"
                      value={tag}
                      onChange={(e) => handleArrayChange(idx, e, "tags")}
                      className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayField(idx, "tags")}
                      disabled={form.tags.length === 1}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("tags")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="assemblyRequired"
                  name="assemblyRequired"
                  type="checkbox"
                  checked={form.assemblyRequired}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="assemblyRequired" className="ml-2 block text-sm text-gray-700">
                  Assembly Required
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Active Product
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;