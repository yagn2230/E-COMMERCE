import React, { useState } from 'react';
import useCoupons from '../hooks/useCoupons';

const CouponModal = ({ onClose }) => {
  const { createCoupon } = useCoupons();

  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minPurchase: '',
    maxDiscount: '',
    expiryDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createCoupon(form);
    if (result.success) {
      onClose();
    } else {
      alert(result.error || 'Failed to create coupon.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4 relative">
        <h2 className="text-2xl font-semibold text-gray-800">Create New Coupon</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Coupon Code*</label>
            <input
              name="code"
              placeholder="e.g. SAVE10"
              value={form.code}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Discount Type*</label>
            <select
              name="discountType"
              value={form.discountType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Discount Value*</label>
            <input
              type="number"
              name="discountValue"
              placeholder="e.g. 10 or 500"
              value={form.discountValue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Min Purchase (₹)</label>
            <input
              type="number"
              name="minPurchase"
              placeholder="e.g. 1000"
              value={form.minPurchase}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Max Discount (₹)</label>
            <input
              type="number"
              name="maxDiscount"
              placeholder="e.g. 200"
              value={form.maxDiscount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Expiry Date*</label>
            <input
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;
