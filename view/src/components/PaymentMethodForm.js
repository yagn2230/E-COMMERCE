// components/checkout/PaymentMethodForm.js
import React from 'react';
import { FiCreditCard, FiShield } from 'react-icons/fi';
import { MdLocalShipping, MdPayment } from 'react-icons/md';

const PaymentMethodForm = ({ form, setForm, cardDetails, handleCardChange, upiId, setUpiId }) => {
  const renderDetails = () => {
    switch (form.paymentMethod) {
      case 'Credit/Debit Card':
        return (
          <div className="space-y-3 mt-4">
            <input placeholder="Card Number" value={cardDetails.cardNumber} onChange={handleCardChange('cardNumber')} className="border px-3 py-2 rounded-md w-full" maxLength="16" />
            <input placeholder="Name on Card" value={cardDetails.cardName} onChange={handleCardChange('cardName')} className="border px-3 py-2 rounded-md w-full" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="MM/YY" value={cardDetails.expiry} onChange={handleCardChange('expiry')} className="border px-3 py-2 rounded-md" />
              <input placeholder="CVV" value={cardDetails.cvv} onChange={handleCardChange('cvv')} className="border px-3 py-2 rounded-md" maxLength="3" />
            </div>
          </div>
        );
      case 'UPI':
        return (
          <div className="mt-4 space-y-3">
            <input placeholder="yourname@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="border px-3 py-2 rounded-md w-full" />
          </div>
        );
      case 'Net Banking':
        return (
          <div className="mt-4 text-sm text-gray-600">
            You'll be redirected to your bank's secure gateway.
          </div>
        );
      default:
        return (
          <div className="mt-4 text-sm text-gray-600">
            Pay when you receive your order.
          </div>
        );
    }
  };

  return (
    <>
      <h2 className="text-lg font-medium text-[#0F2C59] mb-4">Payment Method</h2>
      <div className="space-y-3">
        {['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
          <label key={method} className="flex items-center gap-3 p-3 border rounded-md hover:border-[#0F2C59] cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === method}
              onChange={() => setForm((prev) => ({ ...prev, paymentMethod: method }))}
              className="h-4 w-4 text-[#0F2C59]"
            />
            <span className="flex-1">{method}</span>
            {method === 'Credit/Debit Card' && <FiCreditCard />}
            {method === 'UPI' && <MdPayment />}
            {method === 'Net Banking' && <FiShield />}
            {method === 'Cash on Delivery' && <MdLocalShipping />}
          </label>
        ))}
      </div>
      {renderDetails()}
    </>
  );
};

export default PaymentMethodForm;
