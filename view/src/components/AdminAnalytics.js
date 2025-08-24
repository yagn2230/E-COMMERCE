import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API = process.env.REACT_APP_API_URL || 'https://e-commerce-server-yxxc.onrender.com';

const AdminAnalytics = () => {
  const [report, setReport] = useState({
    salesByDate: [],
    topProducts: [],
    totalRevenue: 0,
    totalOrders: 0,
    uniqueCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API}/admin/analytics`, {
          credentials: 'include',
        });
        const data = await res.json();
        setReport({
          salesByDate: data.salesByDate || [],
          topProducts: data.topProducts || [],
          totalRevenue: data.totalRevenue || 0,
          totalOrders: data.totalOrders || 0,
          uniqueCustomers: data.uniqueCustomers || 0
        });
      } catch (err) {
        console.error('Failed to fetch sales report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const COLORS = ['#0f2c59', '#dac0a3', '#eadbc8', '#f8f0e5', '#ff9999'];

  if (loading) {
    return <p className="p-6 text-gray-500">Loading sales analytics...</p>;
  }

  const dailyData = report.salesByDate.map(d => ({
    date: d._id,
    revenue: d.total
  }));

  const bestSellingData = report.topProducts.map(p => ({
    title: p.product?.title || 'Unknown',
    totalSold: p.totalSold
  }));

  return (
    <div className="p-6 bg-[#f8f0e5] min-h-screen rounded">
      <h1 className="text-2xl font-bold text-[#0f2c59] mb-6">Sales Analytics Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-xl font-semibold text-[#0f2c59]">
            ₹{Number(report.totalRevenue || 0).toFixed(2)}
          </h2>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Orders</p>
          <h2 className="text-xl font-semibold text-[#0f2c59]">{report.totalOrders}</h2>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Unique Customers</p>
          <h2 className="text-xl font-semibold text-[#0f2c59]">{report.uniqueCustomers}</h2>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <p className="text-sm text-gray-500">Top Product Sold</p>
          <h2 className="text-xl font-semibold text-[#0f2c59]">
            {bestSellingData[0]?.title || 'N/A'}
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-[#0f2c59] mb-4">Revenue Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0f2c59" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-[#0f2c59] mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellingData}>
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSold" fill="#dac0a3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white mt-8 p-4 rounded shadow max-w-xl mx-auto">
        <h3 className="text-lg font-semibold text-[#0f2c59] mb-4 text-center">Order Status (Static Example)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Processing', value: 40 },
                { name: 'Shipped', value: 30 },
                { name: 'Delivered', value: 20 },
                { name: 'Cancelled', value: 10 },
              ]}
              dataKey="value"
              outerRadius={100}
              label
            >
              {COLORS.map((color, index) => (
                <Cell key={index} fill={color} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminAnalytics;