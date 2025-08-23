import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useWishlist from "../hooks/useWishlist";
import useCart from "../hooks/useCart";

const formatPrice = (price) => {
  if (!price) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(price.amount || 0)
    .replace(/\.00$/, "");
};

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const ProductCard = ({ product, highlight }) => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, cartItems } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = wishlist?.some(
    (item) => item.productId?._id === product._id
  );
  const cartItem = cartItems?.find((item) => item.productId._id === product._id);
  const itemInCart = cartItem?.quantity || 0;

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product._id, isWishlisted);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product._id);
    setIsAdded(true);
  };

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => setIsAdded(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(`/products/${product.slug}`);
      }}
      className="bg-white rounded-lg md:rounded-2xl shadow hover:shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer overflow-hidden flex flex-col relative group w-full"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/300x300?text=No+Image"
          }
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Category Badge */}
        {product.category?.name && (
          <span className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {product.category.name}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
            isWishlisted
              ? "bg-red-100 text-red-500 animate-heartbeat"
              : "bg-white text-gray-400 hover:text-red-500"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        {/* Product Title */}
        <h3 className="text-base md:text-lg font-semibold mb-1 line-clamp-2">
          <Link to={`/products/${product.slug}`} className="hover:text-[#0f2c59]">
            {highlight ? highlightText(product.title, highlight) : product.title}
          </Link>
        </h3>

        {/* Product Description */}
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mt-2 text-yellow-500 gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className="w-3 h-3 md:w-4 md:h-4"
              fill={i < (product.rating || 4) ? "currentColor" : "none"}
            />
          ))}
        </div>

        {/* Price and Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[#0f2c59] font-bold text-sm md:text-base">
            {formatPrice(product.price)}
          </span>

          {itemInCart > 0 ? (
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product._id, -1);
                }}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all active:scale-95"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="text-xs md:text-sm font-medium">{itemInCart}</span>
              <button
                onClick={handleAddToCart}
                className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[#0f2c59] text-white hover:bg-[#0a1f3d] transition-all active:scale-95"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1 text-xs md:text-sm px-3 py-1 md:px-4 md:py-1.5 rounded-full transition-all active:scale-95 ${
                isAdded
                  ? "bg-green-600 text-white"
                  : "bg-[#0f2c59] text-white hover:bg-[#0a1f3d]"
              }`}
              aria-label={isAdded ? "Added to cart" : "Add to cart"}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="w-3 h-3 md:w-4 md:h-4 animate-checkmark" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;