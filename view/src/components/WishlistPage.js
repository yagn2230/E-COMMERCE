import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiTrash2, FiArrowRight, FiShoppingBag } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import useWishlist from "../hooks/useWishlist";

const WishlistPage = () => {
  const { wishlist, loading, error, toggleWishlist, moveToCart } = useWishlist();

  const handleRemove = (productId) => {
    toggleWishlist(productId, true);
  };

  const handleMoveToCart = (productId) => {
    moveToCart(productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiHeart className="text-5xl text-pink-400 animate-bounce mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error loading wishlist: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiHeart className="text-pink-500 mr-3" />
            Your Wishlist
          </h1>
          {wishlist.length > 0 && (
            <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding your favorite products by clicking the heart icon.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
            >
              Browse Products <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((item) =>
                item.productId ? (
                  <div
                    key={item.productId._id}
                    className="relative group bg-white rounded-xl shadow hover:shadow-md transition duration-200"
                  >
                    <ProductCard product={item.productId} />
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleRemove(item.productId._id)}
                        className="p-2 bg-white rounded-full shadow text-red-500 hover:bg-red-100 transition"
                        title="Remove from wishlist"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveToCart(item.productId._id)}
                        className="p-2 bg-white rounded-full shadow text-green-600 hover:bg-green-100 transition"
                        title="Move to cart"
                      >
                        <FiShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                ) : null
              )}
            </div>

            <div className="mt-10 flex justify-end">
              <Link
                to="/cart"
                className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
              >
                View Cart <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
