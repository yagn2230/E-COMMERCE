import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ParentCollectionPage = () => {
  const { parentName } = useParams();
  const [collectionData, setCollectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await fetch(`${API}/collections/${encodeURIComponent(parentName)}`);
        const data = await res.json();

        if (res.ok) {
          setCollectionData(data);
        } else {
          setError(data.message || 'Failed to load collection');
        }
      } catch (err) {
        setError('Server error');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [parentName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-lg text-[#0F2C59]">
        Loading collection...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!collectionData || collectionData.children.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-600">
        No products found in this collection.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F2C59] mb-10 text-center sm:text-left">
        {collectionData.parentCategory} Collection
      </h1>

      {collectionData.children.map((child) => (
        <section key={child.childCategory} className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#0F2C59]">
              {child.childCategory}
            </h2>
            <Link
              to={`/category/${child.childCategory}`}
              className="text-sm text-[#0F2C59] hover:underline hover:text-blue-600 transition"
            >
              View all →
            </Link>
          </div>

          {child.products.length === 0 ? (
            <p className="text-gray-500 text-sm">No products in this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {child.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ParentCollectionPage;
