import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import ProductCard from './ProductCard';

const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialQuery = new URLSearchParams(location.search).get('q') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState([]);
    const [sortOrder, setSortOrder] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedSearch = useMemo(
        () =>
            debounce(async (searchTerm) => {
                if (!searchTerm.trim()) {
                    setResults([]);
                    setLoading(false);
                    return;
                }

                try {
                    setLoading(true);
                    const res = await fetch(`${API}/products/search?q=${encodeURIComponent(searchTerm)}`);
                    const data = await res.json();

                    if (Array.isArray(data)) {
                        setResults(data);
                    } else {
                        console.error('Unexpected response:', data);
                        setError('Unexpected response from server');
                    }
                } catch (err) {
                    console.error('Search fetch failed:', err);
                    setError('Failed to fetch search results');
                } finally {
                    setLoading(false);
                }
            }, 500),
        []
    );

    useEffect(() => {
        setQuery(initialQuery); // update state if URL query changes
    }, [initialQuery]);

    useEffect(() => {
        debouncedSearch(query);
        return () => debouncedSearch.cancel();
    }, [query]);

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const getPrice = (product) =>
        typeof product.price === 'object' ? product.price.amount : product.price;

    const sortedResults = useMemo(() => {
        let sorted = [...results];

        if (sortOrder === 'priceLow') {
            sorted.sort((a, b) => getPrice(a) - getPrice(b));
        } else if (sortOrder === 'priceHigh') {
            sorted.sort((a, b) => getPrice(b) - getPrice(a));
        } else if (sortOrder === 'nameAsc') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === 'nameDesc') {
            sorted.sort((a, b) => b.title.localeCompare(a.title));
        }

        return sorted;
    }, [results, sortOrder]);

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                    Search Results for: <span className="text-[#0F2C59]">{query}</span>
                </h2>
                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="px-4 py-2 border rounded-lg bg-white focus:outline-none"
                >
                    <option value="">Sort by</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="nameAsc">Name: A-Z</option>
                    <option value="nameDesc">Name: Z-A</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : sortedResults.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedResults.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => navigate(`/product/${product._id}`)}
                            highlight={query}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
