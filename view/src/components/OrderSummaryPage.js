import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeftCircle, FiX, FiTag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useCoupon from '../hooks/useCoupon'; // ✅ Adjust the path as needed

const OrderSummaryPage = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [applyingCouponId, setApplyingCouponId] = useState(null);

  // ✅ From hook
  const {
    publicCoupons,
    appliedCoupon,
    discount,
    finalTotal,
    applyCoupon,
    removeCoupon,
  } = useCoupon();

  useEffect(() => {
    const savedItems = localStorage.getItem('cartItems');

    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      setItems(parsedItems);

      const calculatedSubtotal = parsedItems.reduce(
        (acc, item) => acc + (item.productId.price?.amount || 0) * item.quantity,
        0
      );
      setSubtotal(calculatedSubtotal);
    }
  }, []);

  const handleApplyCoupon = async (couponItem) => {
    const meetsMin = subtotal >= (couponItem.minPurchase || 0);
    if (!meetsMin) {
      toast.warning(`This coupon requires minimum purchase of ₹${couponItem.minPurchase}`);
      return;
    }

    setApplyingCouponId(couponItem._id);
    const result = await applyCoupon(couponItem.code, subtotal);
    setApplyingCouponId(null);

    if (result) {
      toast.success(`Coupon "${couponItem.code}" applied!`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      navigate('/checkout');
    }, 1000);
  };

  const total = finalTotal ?? subtotal;

  return (
    <div className="min-h-screen bg-[#f8f0e5] py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold text-[#0f2c59] mb-6 flex items-center gap-3">
              <FiArrowLeftCircle className="text-[#0f2c59]" />
              Order Summary
            </h1>

            {items.length === 0 ? (
              <p className="text-center text-gray-500">
                No items to display. Please go back to cart.
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-lg border border-gray-200">
                    <img
                      src={item.productId.images?.[0] || 'https://via.placeholder.com/96'}
                      alt={item.productId.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h2 className="font-medium text-[#0f2c59]">{item.productId.title}</h2>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{item.productId.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-[#0f2c59]">Qty: {item.quantity}</span>
                        <p className="font-medium text-[#0f2c59]">
                          ₹{(item.productId.price?.amount * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow sticky top-4">
            <h2 className="text-lg font-semibold text-[#0f2c59] mb-4">Order Summary</h2>

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between mb-2 text-green-600">
                <span>Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between mb-2 text-gray-700">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>

            <hr className="my-3 border-gray-200" />

            <div className="flex justify-between text-lg font-medium text-[#0f2c59]">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            {/* Coupon Section */}
            {publicCoupons?.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold mb-2 text-[#0f2c59] flex items-center gap-2">
                  <FiTag /> Available Coupons
                </h4>
                <ul className="text-sm space-y-2">
                  {publicCoupons.map((couponItem) => {
                    const isApplied = appliedCoupon?.code === couponItem.code;
                    const meetsMin = subtotal >= (couponItem.minPurchase || 0);

                    return (
                      <li
                        key={couponItem._id}
                        className="flex justify-between items-center p-2 rounded bg-white shadow-sm"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium">{couponItem.code}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {couponItem.discountType === 'percentage'
                              ? `${couponItem.discountValue}% Off`
                              : `₹${couponItem.discountValue} Off`}
                            {couponItem.minPurchase && ` (Min. ₹${couponItem.minPurchase})`}
                          </div>
                        </div>

                        <button
                          onClick={() => handleApplyCoupon(couponItem)}
                          disabled={isApplied || applyingCouponId === couponItem._id || !meetsMin}
                          className={`px-3 py-1 text-xs rounded-md ${
                            isApplied
                              ? 'bg-green-100 text-green-800'
                              : !meetsMin
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#0f2c59] text-white hover:bg-[#dac0a3] hover:text-[#0f2c59]'
                          }`}
                        >
                          {isApplied
                            ? 'Applied'
                            : applyingCouponId === couponItem._id
                            ? 'Applying...'
                            : !meetsMin
                            ? 'Min Not Met'
                            : 'Apply'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Remove coupon */}
            {appliedCoupon && (
              <div className="mt-4 text-sm">
                <button
                  onClick={removeCoupon}
                  className="text-red-500 hover:text-red-700 flex items-center"
                >
                  <FiX className="mr-1" size={12} /> Remove coupon
                </button>
              </div>
            )}

            <div className="text-center text-sm mt-4">
              <Link
                to="/coupon"
                className="text-[#0f2c59] hover:text-[#dac0a3] hover:underline"
              >
                Apply Coupon
              </Link>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className={`mt-6 w-full py-3 rounded-lg transition ${
                isCheckingOut || items.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#0f2c59] text-white hover:bg-[#dac0a3] hover:text-[#0f2c59]'
              }`}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <div className="text-center text-sm mt-4">
              <Link
                to="/shop"
                className="text-[#0f2c59] hover:text-[#dac0a3] hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;
