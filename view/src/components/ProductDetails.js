import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiCheck, FiArrowRight } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import useCart from "../hooks/useCart";
import { Link, useNavigate } from "react-router-dom";

const formatPrice = (price) => {
  if (!price) return "₹0";
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price.amount || 0).replace(/\.00$/, '');
};

const getCategoryColor = (category) => {
  const colors = {
    'Electronics': 'bg-blue-100 text-blue-800',
    'Clothing': 'bg-purple-100 text-purple-800',
    'Home': 'bg-green-100 text-green-800',
    'Books': 'bg-yellow-100 text-yellow-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const renderRatingStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
  }
  return stars;
};

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const { addToCart, error } = useCart();
  const navigate = useNavigate();

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const handleQuantityChange = (newQty) => {
    if (newQty < 1) return;
    if (product.stock && newQty > product.stock) {
      setQuantity(product.stock);
      return;
    }
    setQuantity(newQty);
  };

  const handleAddToCart = async () => {
    if (product.stock === 0) return;
    try {
      await addToCart(product._id, quantity);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 3000);
    } catch (err) {
      console.error('Failed to add to cart:', err.message);
    }
  };

  return (
    <div className="flex flex-col bg-[#f8f0e5] p-4 sm:p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <p className={`inline-block mb-2 sm:mb-3 px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category?.name)}`}>
            {product.category?.name || 'Uncategorized'}
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-[#0f2c59]">{product.title}</h1>
          {product.brand && (
            <p className="text-gray-600 mb-2 sm:mb-3">Brand: <span className="font-medium">{product.brand}</span></p>
          )}
        </div>

        {product.rating && (
          <div className="flex items-center bg-[#dac0a3] px-2 py-1 sm:px-3 sm:py-1 rounded-full self-start sm:self-auto">
            {renderRatingStars(product.rating)}
            <span className="ml-1 text-sm font-medium text-[#0f2c59]">{product.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="my-3 sm:my-4 p-3 sm:p-4 bg-[#eadbc8] rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2c59]">
            {formatPrice(product.price)}
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            {product.originalPrice && (
              <div className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            {product.originalPrice && (
              <div className="text-sm font-semibold bg-[#dac0a3] text-[#0f2c59] px-2 py-1 rounded">
                {Math.round((1 - product.price.amount / product.originalPrice.amount) * 100)}% OFF
              </div>
            )}
          </div>
        </div>

        {product.stock > 0 ? (
          <div className="mt-2 flex items-center text-green-600">
            <FiCheck className="mr-1" />
            <span className="font-medium">In Stock</span>
            {product.stock <= 10 && (
              <span className="ml-2 text-sm text-orange-600">Only {product.stock} left!</span>
            )}
          </div>
        ) : (
          <div className="mt-2 text-red-600 font-medium">Out of Stock</div>
        )}
      </div>

      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold mb-2 text-[#0f2c59]">Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      </div>

      {product.features && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg font-semibold mb-2 text-[#0f2c59]">Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <label htmlFor="quantity" className="font-semibold text-[#0f2c59]">
            Quantity:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-2 bg-[#eadbc8] hover:bg-[#dac0a3] disabled:opacity-50 transition-colors"
              disabled={quantity <= 1}
            >−</button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock || 1}
              value={quantity}
              onChange={e => {
                const newQty = parseInt(e.target.value) || 1;
                handleQuantityChange(newQty);
              }}
              className="w-16 text-center py-2 outline-none border-x border-gray-300 bg-white"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-2 bg-[#eadbc8] hover:bg-[#dac0a3] disabled:opacity-50 transition-colors"
              disabled={product.stock && quantity >= product.stock}
            >+</button>
          </div>
          {product.stock && (
            <span className="text-sm text-gray-500">Max {product.stock} per order</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          className={`flex-1 flex items-center justify-center py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all ${
            product.stock === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : showAddedToCart
                ? "bg-green-500 text-white"
                : "bg-[#0f2c59] hover:bg-[#dac0a3] hover:text-[#0f2c59] text-white"
          }`}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {showAddedToCart ? (
            <>
              <FiCheck className="mr-2" /> Added to Cart
            </>
          ) : (
            <>
              <FiShoppingCart className="mr-2" /> Add to Cart
            </>
          )}
        </button>

       
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Delivery Info */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white rounded-lg border border-[#dac0a3]">
        <div className="flex items-start space-x-3">
          <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-[#0f2c59]">Free Delivery</p>
            <p className="text-sm text-gray-700">Get free delivery on this item for orders above ₹499</p>
          </div>
        </div>

        <div className="flex items-start space-x-3 mt-3">
          <FiCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-[#0f2c59]">Easy Returns</p>
            <p className="text-sm text-gray-700">Return the product within 15 days for a full refund</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;