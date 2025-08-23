import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import useCoupon from '../hooks/useCoupon';

const CouponList = () => {
  const {
    publicCoupons,
    fetchPublicCoupons,
    applyCoupon,
    appliedCoupon,
    removeCoupon,
    loading,
    error,
  } = useCoupon();

  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicCoupons();
  }, []);

  const handleApply = async (coupon) => {
    const totalAmount = JSON.parse(localStorage.getItem('cartItems') || '[]').reduce(
      (acc, item) => acc + (item.productId.price?.amount || 0) * item.quantity,
      0
    );

    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      return toast.error(`Minimum order amount of ₹${coupon.minAmount} required`);
    }

    const result = await applyCoupon(coupon.code, totalAmount);
    if (result) {
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
      setTimeout(() => {
        navigate('/order-summery'); // make sure this route exists and is spelled correctly
      }, 1000);
    }
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const now = new Date();
    const exp = new Date(expiryDate);
    const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
    return daysLeft <= 3 && daysLeft > 0;
  };

  const validCoupons = publicCoupons?.filter(
    (coupon) => !isExpired(coupon.expiryDate)
  );

  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-[#0f2c59] hover:text-[#dac0a3] flex items-center gap-2 text-sm"
        >
          <FiArrowLeftCircle size={18} />
          Back
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-[#0f2c59]">
          🎟️ Available Coupons
        </h2>

        {loading && <p>Loading coupons...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {appliedCoupon && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm text-center">
            ✅ Coupon <strong>{appliedCoupon.code}</strong> applied!
            <button
              onClick={removeCoupon}
              className="block text-red-500 mt-2 text-sm underline hover:text-red-600"
            >
              Remove Coupon
            </button>
          </div>
        )}

        {validCoupons?.length === 0 && !loading ? (
          <p className="text-gray-500 text-center">No valid coupons available at the moment.</p>
        ) : (
          <ul className="space-y-4">
            {validCoupons.map((coupon) => {
              const isApplied = appliedCoupon?.code === coupon.code;

              return (
                <li
                  key={coupon._id}
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-200 bg-[#fff9f0]"
                >
                  <div>
                    <p className="font-semibold text-[#0f2c59] flex items-center gap-2">
                      {coupon.code}
                      {isExpiringSoon(coupon.expiryDate) && (
                        <span className="text-xs bg-yellow-300 text-yellow-900 px-2 py-0.5 rounded">
                          Expiring Soon
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {coupon.discountType === 'percentage'
                        ? `Get ${coupon.discountValue}% OFF`
                        : `Save ₹${coupon.discountValue}`}
                      {coupon.minAmount && ` on min purchase of ₹${coupon.minAmount}`}
                    </p>
                    {coupon.expiryDate && (
                      <p className="text-xs text-gray-500">
                        Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <button
                    className={`px-4 py-1.5 rounded text-sm font-medium transition duration-200 ${
                      isApplied
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-[#0f2c59] text-white hover:bg-[#dac0a3] hover:text-[#0f2c59]'
                    }`}
                    onClick={() => !isApplied && handleApply(coupon)}
                    disabled={isApplied}
                  >
                    {isApplied ? 'Applied' : 'Apply'}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CouponList;
