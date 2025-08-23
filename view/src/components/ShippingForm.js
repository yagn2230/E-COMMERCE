
import React from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiMapPin } from 'react-icons/fi';

const ShippingForm = ({
  form,
  setForm,
  handleChange,
  showForm,
  setShowForm,
  savedAddress,
  handleDeleteAddress
}) => {
  return (
    <>
      <h2 className="text-lg font-medium text-[#0F2C59] mb-4">Shipping Information</h2>

      {!showForm && savedAddress ? (
        <div className="space-y-3 text-sm text-[#0F2C59] bg-[#F8F0E5] p-4 rounded-md relative border border-green-200">
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
            <FiCheck className="mr-1" /> Saved Address
          </div>
          <div className="flex items-start gap-3">
            <FiMapPin className="text-lg mt-1 text-[#0F2C59]" />
            <div>
              <p className="font-medium">{savedAddress.firstName} {savedAddress.lastName}</p>
              <p>{savedAddress.address}, {savedAddress.city}, {savedAddress.state} - {savedAddress.postalCode}</p>
              <p>{savedAddress.country}</p>
              <p className="mt-2">Phone: {savedAddress.phone}</p>
              <p>Email: {savedAddress.email}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-3">
            <button onClick={() => setShowForm(true)} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <FiEdit2 size={14} /> Change Address
            </button>
            <button onClick={handleDeleteAddress} className="text-sm text-red-600 hover:underline flex items-center gap-1">
              <FiTrash2 size={14} /> Delete Address
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="First Name*" value={form.firstName} onChange={handleChange('firstName')} className="border px-3 py-2 rounded-md w-full" />
            <input placeholder="Last Name*" value={form.lastName} onChange={handleChange('lastName')} className="border px-3 py-2 rounded-md w-full" />
          </div>

          <input type="email" placeholder="Email*" value={form.email} onChange={handleChange('email')} className="border px-3 py-2 rounded-md w-full" />
          <input type="tel" placeholder="Phone*" value={form.phone} onChange={handleChange('phone')} className="border px-3 py-2 rounded-md w-full" />
          <input placeholder="Street Address*" value={form.address} onChange={handleChange('address')} className="border px-3 py-2 rounded-md w-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input placeholder="City*" value={form.city} onChange={handleChange('city')} className="border px-3 py-2 rounded-md" />
            <input placeholder="State*" value={form.state} onChange={handleChange('state')} className="border px-3 py-2 rounded-md" />
            <input placeholder="Postal Code*" value={form.postalCode} onChange={handleChange('postalCode')} className="border px-3 py-2 rounded-md" />
          </div>

          <select value={form.country} onChange={handleChange('country')} className="border px-3 py-2 rounded-md w-full">
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
          </select>

          {savedAddress && (
            <button onClick={() => setShowForm(false)} className="text-sm text-gray-600 underline mt-2">
              Back to Saved Address
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ShippingForm;
