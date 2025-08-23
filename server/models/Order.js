const { stat } = require("fs");
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Refund Pending', 'Cash on Delivery', 'Refunded'],
    default: 'Pending'
  },
  deliveryStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  },
  cancelReason: { type: String },
  deliveryDate: { type: Date },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
