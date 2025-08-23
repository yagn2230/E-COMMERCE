import React, { useState } from "react";
import { FiHeart, FiShare2 } from "react-icons/fi";

const ImageGallery = ({ images = [], title }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="space-y-4 w-full">
      {/* Main Image */}
      <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <img
          src={images[selectedImageIndex] || "https://via.placeholder.com/800x800?text=No+Image"}
          alt={title}
          className="w-full h-[300px] sm:h-[400px] md:h-[450px] object-contain transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2 rounded-full shadow-md transition ${
              isWishlisted ? "bg-red-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FiHeart className={`${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <button className="p-2 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100 transition">
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImageIndex(idx)}
            className={`flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
              selectedImageIndex === idx
                ? "border-[#0F2C59] shadow-md"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`${title} thumbnail ${idx + 1}`}
              className="h-20 w-20 object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/100?text=No+Image";
                e.target.onerror = null;
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
