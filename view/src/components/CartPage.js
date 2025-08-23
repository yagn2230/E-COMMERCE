// CartPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import useCoupon from '../hooks/useCoupon';
import { FiShoppingBag } from 'react-icons/fi';

import CartItemsList from './CartItemsList';
import EmptyCartMessage from './EmptyCartMessage';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    error,
    removeFromCart,
    updateCartItem,
    refreshCart,
  } = useCart();

  const {
    applyCoupon,
    discount,
    finalTotal,
    publicCoupons,
    loading: couponLoading,
  } = useCoupon();

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);
  const [applyingCouponId, setApplyingCouponId] = useState(null);
  const [updatingItems, setUpdatingItems] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('appliedCoupon');
    if (saved) setAppliedCoupon(JSON.parse(saved));
  }, []);

  const selectedInStockItems = cart.filter(
    item => item.productId.stock > 0 && selectedItems.includes(item._id)
  );

  const subtotal = selectedInStockItems.reduce(
    (sum, item) => sum + (item.productId.price?.amount || 0) * item.quantity,
    0
  );

  const total = finalTotal !== null ? finalTotal : subtotal;

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || updatingItems[productId]) return;
    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      await updateCartItem(productId, newQuantity);
      await refreshCart();
    } catch (err) {
      console.error('Failed to update quantity:', err);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleApplyCoupon = async (coupon) => {
    setApplyingCouponId(coupon._id);
    try {
      const response = await applyCoupon(coupon.code, subtotal);
      if (response && response.discount) {
        const applied = {
          code: coupon.code,
          discount: response.discount,
          couponId: coupon._id
        };
        setAppliedCoupon(applied);
        localStorage.setItem('appliedCoupon', JSON.stringify(applied));
      } else {
        alert('Invalid or expired coupon');
      }
    } catch (err) {
      console.error('Failed to apply coupon:', err);
    } finally {
      setApplyingCouponId(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  };

  const handleCheckout = () => {
    const selected = cart.filter(item => selectedItems.includes(item._id));
    if (selected.length === 0) {
      alert('Select at least one item to checkout.');
      return;
    }
    setIsCheckingOut(true);
    localStorage.setItem('cartItems', JSON.stringify(selected));
    localStorage.setItem('totalAmount', total.toFixed(2));
    if (appliedCoupon) {
      localStorage.setItem('coupon', JSON.stringify(appliedCoupon));
    }
    setTimeout(() => {
      setIsCheckingOut(false);
      navigate('/order-summery');
    }, 1500);
  };

  const handleClearCart = async () => {
    try {
      await Promise.all(cart.map(item => removeFromCart(item.productId._id)));
      setShowClearCartConfirm(false);
      localStorage.removeItem('appliedCoupon');
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  const handleCheckboxChange = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isCouponExpired = (coupon) => {
    if (!coupon.expiryDate) return false;
    return new Date(coupon.expiryDate) < new Date();
  };

  const validCoupons = publicCoupons?.filter(c => !isCouponExpired(c)) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f0e5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f2c59]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f0e5]">
        <p className="text-red-500 text-center">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f0e5] min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#0f2c59] mb-6 flex items-center gap-3">
          <FiShoppingBag className="text-[#0f2c59]" />
          Your Cart ({cart.length})
        </h1>

        {cart.length === 0 ? (
          <EmptyCartMessage />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <CartItemsList
                cart={cart}
                handleQuantityChange={handleQuantityChange}
                removeFromCart={removeFromCart}
                updatingItems={updatingItems}
                showClearCartConfirm={showClearCartConfirm}
                setShowClearCartConfirm={setShowClearCartConfirm}
                handleClearCart={handleClearCart}
                selectedItems={selectedItems}
                handleCheckboxChange={handleCheckboxChange}
              />

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0 || isCheckingOut}
                className={`w-full mt-4 py-3 px-4 rounded font-semibold text-white transition ${
                  selectedItems.length === 0 || isCheckingOut
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#0f2c59] hover:bg-[#1a3b7c]'
                }`}
              >
                {isCheckingOut ? 'Processing...' : 'Buy Now'}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;