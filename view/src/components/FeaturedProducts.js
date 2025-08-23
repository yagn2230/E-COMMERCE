import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${API}/products?featured=true&limit=4`);
        const data = await res.json();
        setProducts(Array.isArray(data.products) ? data.products : []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-12 px-2 sm:px-4 md:px-6 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59] mb-3 tracking-tight">Featured Products</h2>
          <p className="text-gray-600 text-base md:text-lg">Top picks from our curated furniture collection</p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-60 md:h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => (
              <Link
                to={`/products/${product.slug}`}
                key={product._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-40 md:h-56 overflow-hidden">
                  <img
                    src={product.images?.[0] || '/placeholder-furniture.jpg'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/placeholder-furniture.jpg';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 group-hover:text-[#0F2C59] mb-1 transition-colors duration-300">
                    {product.title}
                  </h3>
                  <p className="text-[#0F2C59] font-medium text-sm md:text-base">
                    ₹{product.price?.amount?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No featured products found.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
