import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, Copy, Search, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCoupon from '../hooks/useCoupon'; // Updated Hook

const AdminCouponManager = () => {
  const {
    adminCoupons,
    fetchAdminCoupons,
    createAdminCoupon,
    updateAdminCoupon,
    deleteAdminCoupon,
    adminLoading,
  } = useCoupon();

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ startDate: null, endDate: null });

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountValue: '',
    discountType: 'percentage',
    minPurchase: '',
    expiryDate: '',
    maxUsage: '',
    description: '',
  });

  useEffect(() => {
    fetchAdminCoupons();
  }, [fetchAdminCoupons]);

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date, field) => {
    setNewCoupon({ ...newCoupon, [field]: date });
  };

  const validateCoupon = () => {
    const { code, discountValue, discountType, expiryDate } = newCoupon;

    if (!code || !discountValue || !expiryDate) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
      toast.error('Percentage discount must be between 1-100');
      return false;
    }

    if (new Date(expiryDate) < new Date()) {
      toast.error('Expiry date must be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCoupon()) return;

    const formatted = {
      ...newCoupon,
      discountValue: Number(newCoupon.discountValue),
      minPurchase: newCoupon.minPurchase ? Number(newCoupon.minPurchase) : 0,
      maxUsage: newCoupon.maxUsage ? Number(newCoupon.maxUsage) : null,
      expiryDate: new Date(newCoupon.expiryDate).toISOString(),
    };

    try {
      if (editMode && currentCoupon) {
        await updateAdminCoupon(currentCoupon._id, formatted);
      } else {
        await createAdminCoupon(formatted);
      }
      resetForm();
    } catch (err) {
      // Error already handled in hook
    }
  };

  const resetForm = () => {
    setNewCoupon({
      code: '',
      discountValue: '',
      discountType: 'percentage',
      minPurchase: '',
      expiryDate: '',
      maxUsage: '',
      description: '',
    });
    setEditMode(false);
    setCurrentCoupon(null);
    setShowForm(false);
  };

  const editCoupon = (coupon) => {
    setNewCoupon({
      code: coupon.code,
      discountValue: coupon.discountValue,
      discountType: coupon.discountType,
      minPurchase: coupon.minPurchase,
      expiryDate: new Date(coupon.expiryDate),
      maxUsage: coupon.maxUsage,
      description: coupon.description || '',
    });
    setCurrentCoupon(coupon);
    setEditMode(true);
    setShowForm(true);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteAdminCoupon(id);
      } catch (err) {}
    }
  };

  const isExpired = (expiryDate) => new Date(expiryDate) < new Date();

  const filteredCoupons = adminCoupons
    .filter((c) => c.code.toLowerCase().includes(search.toLowerCase()))
    .filter((c) => {
      if (filter === 'active') return !isExpired(c.expiryDate);
      if (filter === 'expired') return isExpired(c.expiryDate);
      return true;
    })
    .filter((c) => {
      if (!dateFilter.startDate || !dateFilter.endDate) return true;
      const couponDate = new Date(c.expiryDate);
      return couponDate >= dateFilter.startDate && couponDate <= dateFilter.endDate;
    })
    .sort((a, b) => new Date(b.expiryDate) - new Date(a.expiryDate));

  const stats = {
    total: adminCoupons.length,
    active: adminCoupons.filter((c) => !isExpired(c.expiryDate)).length,
    expired: adminCoupons.filter((c) => isExpired(c.expiryDate)).length,
  };

  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen rounded">
      <h1 className="text-2xl font-bold text-[#0f2c59] mb-6">Coupon Management</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 shadow rounded"><p>Total</p><h2>{stats.total}</h2></div>
        <div className="bg-white p-4 shadow rounded"><p>Active</p><h2>{stats.active}</h2></div>
        <div className="bg-white p-4 shadow rounded"><p>Expired</p><h2>{stats.expired}</h2></div>
      </div>

      {/* Actions */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="border pl-10 pr-4 py-2 rounded w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded text-sm">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        <div className="relative">
          <DatePicker
            selectsRange
            startDate={dateFilter.startDate}
            endDate={dateFilter.endDate}
            onChange={([start, end]) => setDateFilter({ startDate: start, endDate: end })}
            isClearable
            className="border p-2 rounded text-sm pl-8 w-48"
            placeholderText="Filter by date"
          />
          <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0f2c59] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#1a3f7a]"
        >
          <Plus size={16} />
          {showForm ? 'Cancel' : 'Add Coupon'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6 space-y-4">
          <h2 className="text-lg font-semibold">{editMode ? 'Edit Coupon' : 'Create New Coupon'}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="code" value={newCoupon.code} onChange={handleChange} required placeholder="Code *"
              className="border p-2 rounded" />
            <select name="discountType" value={newCoupon.discountType} onChange={handleChange} className="border p-2 rounded">
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
            <input type="number" name="discountValue" value={newCoupon.discountValue}
              placeholder={newCoupon.discountType === 'percentage' ? 'e.g. 10%' : 'e.g. ₹200'}
              onChange={handleChange} required className="border p-2 rounded" />
            <input type="number" name="minPurchase" value={newCoupon.minPurchase} onChange={handleChange}
              placeholder="Min Order (optional)" className="border p-2 rounded" />
            <DatePicker
              selected={newCoupon.expiryDate}
              onChange={(date) => handleDateChange(date, 'expiryDate')}
              minDate={new Date()} required className="border p-2 rounded" placeholderText="Expiry Date"
              dateFormat="yyyy-MM-dd"
            />
            <input type="number" name="maxUsage" value={newCoupon.maxUsage} onChange={handleChange}
              placeholder="Max Usage (optional)" className="border p-2 rounded" />
            <textarea name="description" value={newCoupon.description} onChange={handleChange}
              placeholder="Description (optional)" className="md:col-span-2 border p-2 rounded" />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-[#0f2c59] text-white px-4 py-2 rounded">
              {editMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {/* Coupon List */}
      {adminLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-[#0f2c59] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredCoupons.length > 0 ? (
        <div className="bg-white p-4 rounded shadow space-y-4">
          {filteredCoupons.map(coupon => (
            <div key={coupon._id} className={`border p-4 rounded ${isExpired(coupon.expiryDate) ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-start gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0f2c59] text-lg">{coupon.code}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${isExpired(coupon.expiryDate)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'}`}>
                      {isExpired(coupon.expiryDate) ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `₹${coupon.discountValue} Off`}
                    {coupon.minPurchase > 0 && ` | Min: ₹${coupon.minPurchase}`}
                    {coupon.maxUsage && ` | Max Use: ${coupon.maxUsage}`}
                  </div>
                  {coupon.description && <div className="text-xs text-gray-500">{coupon.description}</div>}
                  <div className="text-xs text-gray-400">
                    Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyCouponCode(coupon.code)} title="Copy" className="hover:text-[#0f2c59]"><Copy size={16} /></button>
                  <button onClick={() => editCoupon(coupon)} title="Edit" className="hover:text-[#0f2c59]"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(coupon._id)} title="Delete" className="hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center bg-white p-6 rounded shadow">
          <p className="text-gray-500">No coupons found with current filters.</p>
          <button onClick={() => {
            setSearch('');
            setFilter('all');
            setDateFilter({ startDate: null, endDate: null });
          }} className="mt-4 px-4 py-2 bg-[#0f2c59] text-white rounded">Clear Filters</button>
        </div>
      )}
    </div>
  );
};

export default AdminCouponManager;
