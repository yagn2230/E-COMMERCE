import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

const CategoryProducts = () => {
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API}/products`);
        const data = await res.json();

        const items = Array.isArray(data) ? data : data.products;

        if (!Array.isArray(items)) {
          console.error("Product data is not an array!");
          return;
        }

        const grouped = {};
        items.forEach(product => {
          const parentCategory = product.category?.parent?.name || 'Others';

          if (!grouped[parentCategory]) grouped[parentCategory] = [];

          if (grouped[parentCategory].length < 6) {
            grouped[parentCategory].push(product);
          }
        });

        setProducts(grouped);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full bg-white textColor px-4 py-16">
      {Object.keys(products).length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        Object.entries(products).map(([parentCategory, items]) => (
          <section key={parentCategory} className="mb-16 max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold capitalize text-[#0F2C59]">{parentCategory} Collection</h2>
              <p className="text-[#6D6D6D] text-lg">
                Explore premium {parentCategory.toLowerCase()} options for your home
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(product => {
                const firstImage = product.images?.[0];
                const imageUrl =
                  firstImage?.startsWith('http')
                    ? firstImage
                    : firstImage
                    ? `${API}/${firstImage}`
                    : '/fallback.jpg';

                return (
                  <Link
                    to={`/products/${product.slug}`}
                    key={product._id}
                    className="group rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/fallback.jpg';
                          e.target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="p-4 bg-white">
                      <h3 className="text-xl font-semibold text-[#0F2C59]">{product.title}</h3>
                      <p className="text-[#0F2C59] font-medium mt-2">
                        ₹
                        {typeof product.price === 'object'
                          ? product.price.amount
                          : product.price || 'N/A'}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default CategoryProducts;
