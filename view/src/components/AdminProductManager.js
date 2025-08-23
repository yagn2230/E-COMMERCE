import React from "react";
import { Pencil, Trash2, Package } from "lucide-react";

const AdminProductManager = ({ products, loading, onEditProduct, onDeleteProduct }) => {
  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen rounded">
      <h1 className="text-2xl font-bold text-[#0f2c59] mb-6">Product Management</h1>

      {/* Stats Card */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="text-[#0f2c59]" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="text-xl font-semibold text-[#0f2c59]">{products.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white p-6 rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-[#0f2c59] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No products available</h3>
            <p className="text-sm text-gray-500 mt-1">Add a new product to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border border-gray-200 rounded-lg bg-white hover:shadow-md transition relative overflow-hidden group"
              >
                {/* Image Section */}
                <div className="h-48 w-full bg-gray-100 overflow-hidden rounded-t-lg relative">
                  <img
                    src={product.images?.[0] || "/placeholder-product.jpg"}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                    className="p-2 bg-white/90 rounded-full shadow hover:bg-[#f8f0e5] transition"
                    aria-label={`Edit ${product.title}`}
                  >
                    <Pencil size={18} className="text-[#0f2c59]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProduct(product._id);
                    }}
                    className="p-2 bg-white/90 rounded-full shadow hover:bg-red-50 transition"
                    aria-label={`Delete ${product.title}`}
                  >
                    <Trash2 size={18} className="text-red-600" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-[#0f2c59] truncate">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                    {product.description || "No description available"}
                  </p>

                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-[#0f2c59]">
                      ₹{product.price?.amount?.toFixed(2) || "0.00"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        product.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductManager;