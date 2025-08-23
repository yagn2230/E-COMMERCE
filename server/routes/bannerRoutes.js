const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

// Frontend: Get all active banners
router.get('/', bannerController.getAllBanners);

// Admin: Add a banner
router.post('/', bannerController.createBanner);

// Admin: Update a banner
router.put('/:id', bannerController.updateBanner);

// Admin: Delete a banner
router.delete('/:id', bannerController.deleteBanner);

// Admin: Get a banner by ID
router.get('/:id', bannerController.getBannerById);

module.exports = router;
