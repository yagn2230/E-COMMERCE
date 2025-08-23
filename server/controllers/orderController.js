
// 1️⃣ Place Order
const Order = require("../models/Order");
const Product = require("../models/productModel");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const mongoose = require('mongoose');
const { log } = require("console");

const PAYMENT_STATUS = {
  PAID: "Paid",
  PENDING: "Pending",
  REFUND_PENDING: "Refund Pending",
};

exports.placeOrder = async (req, res) => {
  try {
    const {
      products: cartItems,
      shippingAddress: clientAddress,
      totalAmount,
      paymentMethod,
    } = req.body;

    console.log("📨 Backend received cartItems:", cartItems);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    let shippingAddress = clientAddress;

    if (!clientAddress || !clientAddress.address) {
      const user = await User.findById(req.user._id);
      if (!user || !user.shippingAddress || !user.shippingAddress.address) {
        return res.status(400).json({ message: "Shipping address not provided or saved." });
      }

      const saved = user.shippingAddress;
      shippingAddress = {
        fullName: `${saved.firstName} ${saved.lastName}`,
        address: saved.address,
        city: saved.city,
        state: saved.state,
        postalCode: saved.postalCode,
        country: saved.country,
        email: saved.email,
        phone: saved.phone,
      };
    }

    const orderItems = [];
    log("🧾 Preparing order items...");
    for (const item of cartItems) {
      const productIdOrSlug = item.productId || item._id || item.product;
      console.log("🧾 Cart item:", item);
      console.log("🧾 Checking productIdOrSlug:", productIdOrSlug);

      let product = null;
      if (mongoose.Types.ObjectId.isValid(productIdOrSlug)) {
        product = await Product.findById(productIdOrSlug);
        if (product) {
          console.log(`✅ Found product by ID: ${productIdOrSlug} -> ${product.title}`);
        } else {
          console.log(`❌ No product found by ID: ${productIdOrSlug}`);
        }
      }
      // If not found by ID, try by slug
      if (!product) {
        product = await Product.findOne({ slug: productIdOrSlug });
        if (product) {
          console.log(`✅ Found product by slug: ${productIdOrSlug} -> ${product.title}`);
        } else {
          console.log(`❌ No product found by slug: ${productIdOrSlug}`);
        }
      }
      if (!product) {
        console.log(`🚨 Product not found for cart item:`, item);
        return res.status(404).json({ message: `Product not found: ${productIdOrSlug}`, cartItem: item });
      }

      if (product.stock < item.quantity) {
        console.log(`🚨 Insufficient stock for: ${product.title}, requested: ${item.quantity}, available: ${product.stock}`);
        return res.status(400).json({ message: `Insufficient stock for: ${product.title}` });
      }

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const paymentStatus =
      paymentMethod === "Cash on Delivery" ? PAYMENT_STATUS.PENDING : PAYMENT_STATUS.PAID;

    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });
    log("✅ Order created successfully:", order);

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.status(500).json({ error: error.message });
  }
};






// 2️⃣ Get User Orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3️⃣ Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancelReason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if ([DELIVERY_STATUS.SHIPPED, DELIVERY_STATUS.DELIVERED].includes(order.deliveryStatus)) {
      return res
        .status(400)
        .json({ error: "Cannot cancel shipped or delivered orders." });
    }

    order.deliveryStatus = DELIVERY_STATUS.CANCELLED;
    order.paymentStatus = PAYMENT_STATUS.REFUND_PENDING;
    order.cancelReason = cancelReason || "No reason provided";

    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled.", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: error.message });
  }
};

// 4️⃣ Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// 5️⃣ Update Order Status (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.deliveryStatus = deliveryStatus;

    if (deliveryStatus === DELIVERY_STATUS.DELIVERED) {
      order.deliveryDate = new Date();
    }

    await order.save();
    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: error.message });
  }
};

// 6️⃣ Validate Coupon
exports.validateCoupon = async (req, res) => {
  try {
    const { code, totalAmount } = req.body;
    console.log("Incoming apply-coupon body:", req.body);
    console.log("Received:", { code, totalAmount });

    if (!code || totalAmount == null) {
      console.log("Missing code or totalAmount");
      return res.status(400).json({ error: 'Code and total amount are required.' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
    console.log("Found coupon:", coupon);

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ error: 'Coupon expired' });
    }

    if (totalAmount < coupon.minPurchase) {
      return res.status(400).json({ error: `Minimum purchase should be ₹${coupon.minPurchase}` });
    }

    let discount = 0;

    if (coupon.discountType === 'percentage') {
      discount = (coupon.discountValue / 100) * totalAmount;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    const finalTotal = totalAmount - discount;
    console.log("Discount applied:", { discount, finalTotal });

    res.json({ success: true, discount, finalTotal, coupon: { code: coupon.code } });
  } catch (err) {
    console.error('Coupon validation failed:', err);
    res.status(500).json({ error: 'Server error while applying coupon' });
  }
};



