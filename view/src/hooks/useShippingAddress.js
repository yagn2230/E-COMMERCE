import { useState, useCallback } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const useShippingAddress = () => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchShippingAddress = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/shipping-address`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok) {
        setAddress(data.shippingAddress); // ✅ matches backend shape now
      } else {
        throw new Error(data.message || 'Failed to fetch address');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateShippingAddress = useCallback(async (form) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/shipping-address`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAddress(data.shippingAddress); // ✅ use returned value
      } else {
        throw new Error(data.message || 'Failed to update address');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    address,
    loading,
    error,
    fetchShippingAddress,
    updateShippingAddress,
  };
};

export default useShippingAddress;
