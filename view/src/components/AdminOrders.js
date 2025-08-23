import React, { useEffect } from 'react';
import useOrder from '../hooks/useOrder';
import OrderCard from '../components/OrderCard';

const AdminOrders = () => {
  const { fetchAllOrders, updateOrderStatus, orders } = useOrder();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">All Orders</h2>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          isAdmin
          onUpdateStatus={updateOrderStatus}
        />
      ))}
    </div>
  );
};

export default AdminOrders;