const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Specific routes first
router.get('/:productId/related', productController.listRelated);
router.post('/:productId/reviews', productController.addReview);
router.get('/search', productController.searchProducts);
router.get('/brands', productController.getAllBrands);

// 🔥 NEW: Get product by slug
router.get('/:slug', productController.getProductBySlug );

// Generic fallback routes
router.get('/:id', productController.productById);
router.get('/', productController.getAllProducts);

module.exports = router;
