const express = require('express');
const router = express.Router();
const { getPublicCoupons } = require('../controllers/userCouponController');

// Public route — show only valid & active coupons
router.get('/coupons', getPublicCoupons);

module.exports = router;
