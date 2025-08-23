import React from 'react';

const OrderCard = ({ order, onCancel, isAdmin, onUpdateStatus }) => {
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onCancel(order._id, 'User cancelled the order');
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onUpdateStatus(order._id, newStatus);
  };

  // Status badge color mapping using the palette
  const statusColors = {
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    'Out for Delivery': 'bg-yellow-100 text-yellow-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800'
  };

  // Format date
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    : 'Date not available';

  return (
    <div className="bg-white rounded-lg shadow-sm border my-6 border-[#DAC0A3] overflow-hidden">
      {/* Order Header */}
      <div className="bg-[#0F2C59] px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h3 className="text-lg font-bold text-[#EADBC8]">
            Order #{order?._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
          </h3>
          <div className="mt-2 sm:mt-0">
            <span className="inline-block bg-[#EADBC8] text-[#0F2C59] px-3 py-1 rounded-full text-xs font-semibold">
              Placed on {orderDate}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content */}
      <div className="p-6">
        {/* Order Summary */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h4 className="text-sm font-semibold text-[#0F2C59] uppercase tracking-wider mb-2">Order Summary</h4>
            <p className="text-2xl font-bold text-[#0F2C59]">
              ₹{order?.totalAmount ? order.totalAmount.toLocaleString('en-IN') : '0'}
            </p>
            <p className="text-sm text-[#0F2C59]/80">{order?.orderItems?.length || 0} items</p>
          </div>

          {/* Status Badges */}
          <div>
            <h4 className="text-sm font-semibold text-[#0F2C59] uppercase tracking-wider mb-2">Status</h4>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order?.deliveryStatus] || 'bg-gray-100 text-gray-800'}`}>
                {order?.deliveryStatus || 'Status not available'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${order?.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {order?.paymentStatus || 'Payment status not available'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-[#0F2C59] uppercase tracking-wider mb-3">Items</h4>
          <div className="space-y-4">
            {order?.orderItems?.map((item, index) => (
              <div key={index} className="flex items-start border-b border-[#EADBC8] pb-4">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md border border-[#DAC0A3] bg-[#F8F0E5]">
                  <img
                    src={item?.image || '/placeholder-product.jpg'}
                    alt={item?.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium text-[#0F2C59]">{item?.name || 'Product Name'}</h3>
                    <p className="text-base font-semibold text-[#0F2C59]">₹{item?.price ? item.price.toLocaleString('en-IN') : '0'}</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-[#0F2C59]/80">Qty: {item?.quantity || 1}</p>
                    <p className="text-sm font-medium text-[#0F2C59]">
                      Total: ₹{(item?.price * item?.quantity || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <p className="text-[#0F2C59]">
          {order?.shippingAddress?.fullName || 'Recipient Name'},<br />
          {order?.shippingAddress?.address || 'Address not specified'},<br />
          {order?.shippingAddress?.city || 'City not specified'}, {order?.shippingAddress?.country || 'Country'}<br />
          {order?.shippingAddress?.postalCode || 'Postal code not specified'}
        </p>


        {/* Action Buttons */}
        {isAdmin ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label htmlFor={`status-${order?._id || 'default'}`} className="text-sm font-medium text-[#0F2C59]">
              Update Status:
            </label>
            <select
              id={`status-${order?._id || 'default'}`}
              defaultValue={order?.deliveryStatus || 'Processing'}
              onChange={handleStatusChange}
              className="bg-[#F8F0E5] border border-[#DAC0A3] text-[#0F2C59] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:border-[#0F2C59]"
            >
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        ) : order?.deliveryStatus === 'Processing' && (
          <div className="flex justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-[#0F2C59] text-[#EADBC8] rounded-md hover:bg-[#0F2C59]/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:ring-offset-2"
            >
              Cancel Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;