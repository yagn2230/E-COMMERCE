import { useState } from 'react';

const useOrder = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // ✅ 1️⃣ Place Order (frontend only)
  const placeOrder = async (orderData) => {
  try {
    setLoading(true);

    console.log("📦 Sending orderData:", orderData);

    const res = await fetch(`${API}/orders/place-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Failed to place order');

    // ✅ Auto-save shipping address
    if (orderData.shippingAddress) {
      await fetch(`${API}/users/shipping-address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(orderData.shippingAddress),
      });
    }

    return data.order;
  } catch (err) {
    setError(err.message);
    console.error("❌ placeOrder:", err.message);
  } finally {
    setLoading(false);
  }
};


  // ✅ 2️⃣ Fetch orders
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/my-orders`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch orders');
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
      console.error("❌ fetchUserOrders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 3️⃣ Cancel Order
  const cancelOrder = async (orderId, cancelReason) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/cancel/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
      return data;
    } catch (err) {
      setError(err.message);
      console.error("❌ cancelOrder:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4️⃣ Admin - Get All Orders
  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/all`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch all orders');
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
      console.error("❌ fetchAllOrders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 5️⃣ Admin - Update Order Status
  const updateOrderStatus = async (orderId, deliveryStatus) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/update/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ deliveryStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update order');
      return data;
    } catch (err) {
      setError(err.message);
      console.error("❌ updateOrderStatus:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 6️⃣ Get shipping address
  const getShippingAddress = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/shipping-address`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch address');
      return data;
    } catch (err) {
      setError(err.message);
      console.error("❌ getShippingAddress:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 7️⃣ Save shipping address
  const saveShippingAddress = async (addressData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders/shipping-address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(addressData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save address');
      return data;
    } catch (err) {
      setError(err.message);
      console.error("❌ saveShippingAddress:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    orders,
    placeOrder,
    fetchUserOrders,
    cancelOrder,
    fetchAllOrders,
    updateOrderStatus,
    getShippingAddress,
    saveShippingAddress,
  };
};

export default useOrder;
