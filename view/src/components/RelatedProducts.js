import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';

const RelatedProducts = ({ productId }) => {
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // ✅ navigation hook

    const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        setError(null);

        fetch(`${API}/products/${productId}/related?limit=4`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch related products (status ${res.status})`);
                }
                return res.json();
            })
            .then((data) => {
                setRelated(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [productId, API]);

    if (loading) return <p>Loading related products...</p>;
    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (!related.length) return <p>No related products found.</p>;

    return (
        <div>
            <h3 className="text-xl  font-semibold mb-4">Related Products</h3>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {related.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[250px] max-w-[280px] flex-shrink-0"
                    >
                        <ProductCard
                            product={product}
                            onClick={() => navigate(`/product/${product._id}`)} // ✅ navigate to details
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
