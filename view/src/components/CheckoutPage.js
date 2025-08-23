import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOrder from '../hooks/useOrder';
import useCart from '../hooks/useCart';
import useShippingAddress from '../hooks/useShippingAddress';
import { FiArrowLeft, FiCheck, FiEdit2, FiMapPin, FiCreditCard, FiShield } from 'react-icons/fi';
import { MdLocalShipping, MdPayment } from 'react-icons/md';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { placeOrder, loading: orderLoading, error: orderError } = useOrder();
  const { clearCart } = useCart();
  const { address: savedAddress, fetchShippingAddress, updateShippingAddress } = useShippingAddress();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'Cash on Delivery',
    email: '',
    phone: '',
  });

  const [showForm, setShowForm] = useState(true);
  const [activeTab, setActiveTab] = useState('shipping');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalAmount = Number(localStorage.getItem('totalAmount')) || 0;
  const coupon = JSON.parse(localStorage.getItem('coupon'));
  const discount = coupon ? totalAmount * 0.1 : 0;
  const shippingFee = totalAmount > 1000 ? 0 : 50;
  const finalTotal = totalAmount - discount + shippingFee;

  // Initialize form state based on saved address
  useEffect(() => {
    fetchShippingAddress();
  }, [fetchShippingAddress]);

  useEffect(() => {
    if (savedAddress && savedAddress.address) {
      setForm({
        firstName: savedAddress.firstName || '',
        lastName: savedAddress.lastName || '',
        address: savedAddress.address || '',
        city: savedAddress.city || '',
        state: savedAddress.state || '',
        postalCode: savedAddress.postalCode || '',
        country: savedAddress.country || 'India',
        paymentMethod: 'Cash on Delivery',
        email: savedAddress.email || '',
        phone: savedAddress.phone || '',
      });
      setShowForm(false); // ✅ Hide form once savedAddress is loaded
    }
  }, [savedAddress]);

  useEffect(() => {
    console.log("Saved address:", savedAddress); // Check if address is loaded
  }, [savedAddress]);


  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleCardChange = (field) => (e) => {
    setCardDetails(prev => ({ ...prev, [field]: e.target.value }));
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'postalCode', 'country', 'email', 'phone'];
    const hasEmpty = requiredFields.some(field => !form[field]?.trim());

    if (hasEmpty) {
      alert('Please fill in all required fields.');
      return false;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty.');
      return false;
    }

    if (!agreeTerms) {
      alert('Please agree to the terms and conditions.');
      return false;
    }

    if (form.paymentMethod === 'Credit/Debit Card') {
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Please enter complete card details.');
        return false;
      }
    }

    if (form.paymentMethod === 'UPI' && !upiId) {
      alert('Please enter your UPI ID.');
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    const shippingAddress = {
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      email: form.email,
      phone: form.phone,
    };

    try {
      // Always update address with current form values when placing order
      await updateShippingAddress(shippingAddress);

      const paymentDetails = form.paymentMethod === 'Credit/Debit Card' ? {
        cardLast4: cardDetails.cardNumber.slice(-4),
        cardType: cardDetails.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
      } : form.paymentMethod === 'UPI' ? {
        upiId: upiId,
      } : null;

      const orderData = {
        products: cartItems.map(item => ({
          productId: item._id,
          price: item.price,
          quantity: item.quantity,
        })),
        customerName: `${form.firstName} ${form.lastName}`.trim(),
        shippingAddress,
        contactInfo: {
          email: form.email,
          phone: form.phone,
        },
        totalAmount: finalTotal,
        subtotal: totalAmount,
        discount,
        shippingFee,
        paymentMethod: form.paymentMethod,
        paymentDetails,
        discountCode: coupon?.code || null,
      };

      console.log("Placing order with data:", orderData);
      

      const result = await placeOrder(orderData);
      if (result) {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('coupon');
        clearCart?.();
        navigate('/order-confirmation', { state: { order: result } });
      }
    } catch (err) {
      console.error('Error placing order:', err);
    }
  };

  const renderPaymentMethod = () => {
    switch (form.paymentMethod) {
      case 'Credit/Debit Card':
        return (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-[#0F2C59]">
              <FiCreditCard />
              <span>Card Details</span>
            </div>
            <input
              type="text"
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChange={handleCardChange('cardNumber')}
              className="border px-3 py-2 rounded-md w-full"
              maxLength="16"
            />
            <input
              type="text"
              placeholder="Name on Card"
              value={cardDetails.cardName}
              onChange={handleCardChange('cardName')}
              className="border px-3 py-2 rounded-md w-full"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={handleCardChange('expiry')}
                className="border px-3 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={handleCardChange('cvv')}
                className="border px-3 py-2 rounded-md"
                maxLength="3"
              />
            </div>
          </div>
        );
      case 'UPI':
        return (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-[#0F2C59]">
              <MdPayment />
              <span>UPI ID</span>
            </div>
            <input
              type="text"
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>
        );
      case 'Net Banking':
        return (
          <div className="mt-4">
            <div className="flex items-center gap-2 text-[#0F2C59]">
              <FiShield />
              <span>You'll be redirected to your bank's secure payment gateway</span>
            </div>
          </div>
        );
      default:
        return (
          <div className="mt-4 flex items-center gap-2 text-[#0F2C59]">
            <MdLocalShipping />
            <span>Pay when you receive your order</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F0E5]">
      <div className="bg-[#0F2C59] text-[#EADBC8] py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-1 rounded-full hover:bg-[#0F2C59] hover:bg-opacity-20 transition"
          >
            <FiArrowLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <main className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className={`flex items-center ${activeTab === 'shipping' ? 'text-[#0F2C59] font-medium' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeTab === 'shipping' ? 'bg-[#0F2C59] text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span>Shipping</span>
              </div>
              <div className="h-1 flex-1 bg-gray-200 mx-2"></div>
              <div className={`flex items-center ${activeTab === 'payment' ? 'text-[#0F2C59] font-medium' : 'text-gray-500'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${activeTab === 'payment' ? 'bg-[#0F2C59] text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span>Payment</span>
              </div>
            </div>

            {activeTab === 'shipping' ? (
              <>
                <h2 className="text-lg font-medium text-[#0F2C59] mb-4">Shipping Information</h2>

                {!showForm && savedAddress?.address ? (
                  <div className="space-y-3 text-sm text-[#0F2C59] bg-[#F8F0E5] p-4 rounded-md">
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
                    <button
                      onClick={() => setShowForm(true)}
                      className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <FiEdit2 size={14} /> Change Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">First Name*</label>
                        <input
                          value={form.firstName}
                          onChange={handleChange('firstName')}
                          className="border px-3 py-2 rounded-md w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Last Name*</label>
                        <input
                          value={form.lastName}
                          onChange={handleChange('lastName')}
                          className="border px-3 py-2 rounded-md w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Email*</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={handleChange('email')}
                        className="border px-3 py-2 rounded-md w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Phone*</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={handleChange('phone')}
                        className="border px-3 py-2 rounded-md w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Street Address*</label>
                      <input
                        value={form.address}
                        onChange={handleChange('address')}
                        className="border px-3 py-2 rounded-md w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">City*</label>
                        <input
                          value={form.city}
                          onChange={handleChange('city')}
                          className="border px-3 py-2 rounded-md w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">State*</label>
                        <input
                          value={form.state}
                          onChange={handleChange('state')}
                          className="border px-3 py-2 rounded-md w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Postal Code*</label>
                        <input
                          value={form.postalCode}
                          onChange={handleChange('postalCode')}
                          className="border px-3 py-2 rounded-md w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Country*</label>
                      <select
                        value={form.country}
                        onChange={handleChange('country')}
                        className="border px-3 py-2 rounded-md w-full"
                      >
                        <option>India</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Canada</option>
                        <option>Australia</option>
                      </select>
                    </div>


                    {savedAddress?.address && (
                      <button
                        onClick={() => setShowForm(false)}
                        className="text-sm text-gray-600 underline mt-2"
                      >
                        Back to Saved Address
                      </button>
                    )}

                    {showForm && (
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={async () => {
                            const shippingAddress = {
                              firstName: form.firstName,
                              lastName: form.lastName,
                              address: form.address,
                              city: form.city,
                              state: form.state,
                              postalCode: form.postalCode,
                              country: form.country,
                              email: form.email,
                              phone: form.phone,
                            };
                            await updateShippingAddress(shippingAddress);
                            setShowForm(false);
                          }}
                          className="px-4 py-2 bg-[#0F2C59] text-white rounded hover:bg-opacity-90"
                        >
                          Save & Continue
                        </button>
                      </div>
                    )}

                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-lg font-medium text-[#0F2C59] mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <div className="flex flex-col gap-2">
                    {['Cash on Delivery', 'Credit/Debit Card', 'UPI', 'Net Banking'].map((method) => (
                      <label key={method} className="flex items-center gap-3 p-3 border rounded-md hover:border-[#0F2C59] cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={form.paymentMethod === method}
                          onChange={() => setForm(prev => ({ ...prev, paymentMethod: method }))}
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

                  {renderPaymentMethod()}
                </div>
              </>
            )}

            <div className="mt-6 flex justify-between">
              {activeTab === 'payment' ? (
                <button
                  onClick={() => setActiveTab('shipping')}
                  className="px-4 py-2 border border-[#0F2C59] text-[#0F2C59] rounded hover:bg-[#0F2C59] hover:text-white transition"
                >
                  Back to Shipping
                </button>
              ) : (
                <div></div>
              )}

              <button
                onClick={() => activeTab === 'shipping' ? setActiveTab('payment') : handlePlaceOrder()}
                disabled={orderLoading}
                className="px-6 py-2 bg-[#0F2C59] text-white rounded hover:bg-opacity-90 flex items-center justify-center gap-2"
              >
                {orderLoading ? 'Processing...' : (
                  activeTab === 'shipping' ? 'Continue to Payment' : (
                    <>
                      <FiCheck className="text-lg" /> Place Order
                    </>
                  )
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-3 text-[#0F2C59] mb-3">
              <FiShield className="text-xl" />
              <h3 className="font-medium">Secure Checkout</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your information is protected by 256-bit SSL encryption. We don't store your payment details.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4 mt-4">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-600">
                I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;