// src/hooks/useCoupon.js
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

const useCoupon = () => {
  const [publicCoupons, setPublicCoupons] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [adminCoupons, setAdminCoupons] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCoupon = localStorage.getItem('coupon');
    if (savedCoupon) {
      try {
        const parsed = JSON.parse(savedCoupon);
        setAppliedCoupon(parsed);
        setDiscount(parsed.discount || 0);
        setFinalTotal(parsed.finalTotal || null);
      } catch (err) {
        console.error('Invalid coupon data in localStorage');
        localStorage.removeItem('coupon');
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('coupon', JSON.stringify({
        ...appliedCoupon,
        discount,
        finalTotal,
      }));
    }
  }, [appliedCoupon, discount, finalTotal]);

  // Public methods
  const fetchPublicCoupons = async () => {
    try {
      const res = await fetch(`${API}/coupons`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load coupons');
      setPublicCoupons(data);
      localStorage.setItem('publicCoupons', JSON.stringify(data));
    } catch (err) {
      setError('Failed to load public coupons');
    }
  };

  const applyCoupon = async (code, totalAmount) => {
    setAdminLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/orders/apply-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code, totalAmount }),
      });
  
      const data = await res.json();

      console.log("Apply coupon response:", data);
      
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');

      setDiscount(data.discount);
      setFinalTotal(data.finalTotal);
      setAppliedCoupon(data.coupon || { code });

      toast.success(`Coupon "${code}" applied!`);
      return data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
      return null;
    } finally {
      setAdminLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setFinalTotal(null);
    localStorage.removeItem('coupon');
    toast.info('Coupon removed');
  };

  // Admin methods (unchanged)
  const fetchAdminCoupons = useCallback(async () => {
    try {
      setAdminLoading(true);
      const res = await fetch(`${API}/admin/coupons`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch coupons');
      setAdminCoupons(data);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Could not load coupons');
    } finally {
      setAdminLoading(false);
    }
  }, []);

  const createAdminCoupon = async (couponData) => {
    try {
      const res = await fetch(`${API}/admin/coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(couponData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create failed');
      setAdminCoupons(prev => [data, ...prev]);
      toast.success('Coupon created successfully');
      return data;
    } catch (err) {
      toast.error(err.message || 'Coupon creation failed');
      throw err;
    }
  };

  const updateAdminCoupon = async (id, couponData) => {
    try {
      const res = await fetch(`${API}/admin/coupons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(couponData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setAdminCoupons(prev => prev.map(c => (c._id === id ? data : c)));
      toast.success('Coupon updated successfully');
      return data;
    } catch (err) {
      toast.error(err.message || 'Coupon update failed');
      throw err;
    }
  };

  const deleteAdminCoupon = async (id) => {
    try {
      const res = await fetch(`${API}/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Delete failed');
      }
      setAdminCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
    } catch (err) {
      toast.error(err.message || 'Coupon deletion failed');
      throw err;
    }
  };

  return {
    // Public
    publicCoupons,
    fetchPublicCoupons,
    applyCoupon,
    removeCoupon,
    discount,
    finalTotal,
    appliedCoupon,

    // Admin
    adminCoupons,
    adminLoading,
    fetchAdminCoupons,
    createAdminCoupon,
    updateAdminCoupon,
    deleteAdminCoupon,

    // Shared
    error,
  };
};

export default useCoupon;
