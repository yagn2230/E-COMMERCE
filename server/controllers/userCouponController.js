const Coupon = require('../models/Coupon');

// GET /coupons
exports.getPublicCoupons = async (req, res) => {
  try {
    const today = new Date();
    const coupons = await Coupon.find({
      active: true,
      expiryDate: { $gte: today },  // ✅ Correct field name
    });

    res.status(200).json(coupons);
  } catch (err) {
    console.error("Error loading coupons:", err);
    res.status(500).json({ error: 'Failed to load coupons' });
  }
};
