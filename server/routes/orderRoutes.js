// routes/orderRoutes.js
const express = require('express');
const {
  placeOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  validateCoupon,
  updateOrderStatus,
} = require("../controllers/orderController.js");
const isAdmin = require("../middleware/isAdmin.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/place-order", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.put("/cancel/:orderId", authMiddleware, cancelOrder);
router.post('/apply-coupon',authMiddleware, validateCoupon);


// Admin routes
router.get("/all", authMiddleware, isAdmin, getAllOrders);
router.put("/update/:orderId", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
