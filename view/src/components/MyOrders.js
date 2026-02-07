import React, { useEffect } from "react";
import useOrder from "../hooks/useOrder";
import OrderCard from "../components/OrderCard";

const MyOrders = () => {
  const { fetchUserOrders, cancelOrder, orders, loading, error } = useOrder();

  useEffect(() => {
    fetchUserOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F0E5] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2C59]">
              My Orders
            </h2>
            <div className="bg-[#0F2C59] text-[#EADBC8] px-4 py-1.5 rounded-full text-sm font-medium">
              {orders.length} {orders.length === 1 ? "Order" : "Orders"}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0F2C59]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-[#F8F0E5] rounded-lg border border-[#DAC0A3]">
              <svg
                className="mx-auto h-16 w-16 text-[#0F2C59]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-4 text-xl font-bold text-[#0F2C59]">
                No Orders Yet
              </h3>
              <p className="mt-2 text-[#0F2C59]/90 max-w-md mx-auto">
                Your order history will appear here once you make purchases.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} onCancel={cancelOrder} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
