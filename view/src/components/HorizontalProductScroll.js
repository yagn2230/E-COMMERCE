import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HorizontalProductScroll = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const API = process.env.REACT_APP_API_URL || "https://e-commerce-server-yxxc.onrender.com";

  const formatPrice = (price) => {
    const amount = typeof price === 'number' ? price :
      typeof price === 'object' && price?.amount !== undefined ? Number(price.amount) :
      0;
    const currency = (typeof price === 'object' && price?.currency) || '₹';
    return { amount, currency };
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    const step = 300;

    const autoScroll = () => {
      intervalRef.current = setInterval(() => {
        if (!container) return;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft + step >= maxScroll) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: step, behavior: 'smooth' });
        }
      }, 4000);
    };

    autoScroll();

    const pause = () => clearInterval(intervalRef.current);
    const resume = autoScroll;

    container?.addEventListener('mouseenter', pause);
    container?.addEventListener('mouseleave', resume);

    return () => {
      clearInterval(intervalRef.current);
      container?.removeEventListener('mouseenter', pause);
      container?.removeEventListener('mouseleave', resume);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();

        const seen = new Set();
        const filtered = (data.products || []).filter(p => {
          const catId = p?.category?._id;
          if (catId && !seen.has(catId)) {
            seen.add(catId);
            return true;
          }
          return false;
        }).slice(0, 10).map(p => {
          const price = formatPrice(p.price);
          const original = formatPrice(p.originalPrice || p.price);
          const discount = formatPrice(p.discountPrice);
          return {
            ...p,
            price,
            originalPrice: original,
            discountPrice: discount,
            hasDiscount: discount.amount < price.amount,
            categoryName: p.category?.name || "Uncategorized",
            mainImage: p.image || p.images?.[0] || "/placeholder-product.jpg"
          };
        });

        setProducts(filtered);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const ProductSkeleton = () => (
    <div className="w-[180px] h-[260px] sm:w-[220px] sm:h-[320px] md:w-[240px] md:h-[360px] lg:w-[280px] lg:h-[380px] bg-gray-200 animate-pulse rounded-xl shadow-md" />
  );

  const displayPrice = (price) =>
    `₹${price.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="px-2 sm:px-4 py-8 sm:py-12 bg-gradient-to-b from-[#f8f4ee] to-white">
      <div className="mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C59] font-serif tracking-tight mb-2 sm:mb-0">
            Shop by different categories
          </h2>
          <Link to="/shop" className="text-sm sm:text-base text-[#0F2C59] hover:text-[#DAC0A3] font-medium flex items-center gap-2 transition-all">
            View All
            <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>

        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="relative">
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:scale-110 transition">
            <FiChevronLeft className="text-[#0F2C59] text-xl" />
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:scale-110 transition">
            <FiChevronRight className="text-[#0F2C59] text-xl" />
          </button>

          <div ref={scrollRef} className="flex overflow-x-auto pb-8 px-2 space-x-6 scroll-smooth scrollbar-thin scrollbar-thumb-[#0F2C59]/30 hide-scrollbar">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length ? (
              products.map(product => (
                <Link
                  key={product._id}
                  to={`/products/${product.slug}`}
                  className="w-[180px] sm:w-[220px] md:w-[240px] lg:w-[280px] flex-shrink-0 rounded-xl shadow-lg hover:shadow-xl transition hover:-translate-y-1 bg-white relative group overflow-hidden"
                >
                  <div className="relative h-[200px] sm:h-[240px] md:h-[280px] lg:h-[320px] overflow-hidden">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => { e.target.src = "/placeholder-product.jpg"; }}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 text-[#0F2C59] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {product.categoryName}
                    </div>
                    {product.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                        Out of Stock
                      </div>
                    )}
                    {product.hasDiscount && (
                      <div className="absolute bottom-3 left-3 bg-[#0F2C59]/90 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                        {Math.round((1 - product.discountPrice.amount / product.price.amount) * 100)}% OFF
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition duration-300">
                      <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                      <p className="text-sm text-white/90 mb-4 line-clamp-2">{product.description?.substring(0, 100)}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{displayPrice(product.price)}</span>
                        {product.hasDiscount && (
                          <span className="text-sm text-white/80 line-through">{displayPrice(product.originalPrice)}</span>
                        )}
                      </div>
                      <button className="mt-2 bg-white text-[#0F2C59] text-sm font-medium px-6 py-2 rounded-full hover:bg-[#0F2C59] hover:text-white transition shadow-md">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <h4 className="font-medium text-base text-gray-800 truncate">{product.name}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">{product.brand || "Premium Brand"}</span>
                      <span className="text-sm font-medium text-[#0F2C59]">{displayPrice(product.price)}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center w-full py-10">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProductScroll;
