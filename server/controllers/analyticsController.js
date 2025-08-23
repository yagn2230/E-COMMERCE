const Order = require('../models/Order');
const Product = require('../models/productModel');
const User = require('../models/User');

exports.getSalesAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({});

    // ✅ Count revenue from ALL orders (no paymentStatus filter)
    const totalRevenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue = totalRevenueData[0]?.totalRevenue || 0;

    const uniqueCustomers = await Order.distinct("user");

    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
          revenue: { $sum: "$products.subtotal" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" }
    ]);

    const salesByDate = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      uniqueCustomers: uniqueCustomers.length,
      topProducts,
      salesByDate
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
