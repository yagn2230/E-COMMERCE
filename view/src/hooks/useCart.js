import { useState, useEffect } from 'react';

const useCart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

    const fetchCart = async () => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`${API}/cart`, { credentials: 'include' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch cart');
            setCart(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await fetch(`${API}/cart/add/${productId}`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };
    const removeFromCart = async (productId) => {
        try {
            const res = await fetch(`${API}/cart/remove/${productId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to remove item from cart');
            }

            await fetchCart(); // Refresh local cart after successful deletion
        } catch (err) {
            console.error('Remove from cart failed:', err);
            setError(err.message || 'Something went wrong while removing the item.');
        }
    };


    const updateCartItem = async (productId, quantity) => {
        try {
            const res = await fetch(`${API}/cart/update/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ quantity })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            await fetchCart();
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    return { cart, loading, error, addToCart, removeFromCart, updateCartItem, refreshCart: fetchCart };
};

export default useCart;
