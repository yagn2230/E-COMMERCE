const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/add/:productId', isAuthenticated, cartController.addToCart);
router.get('/', isAuthenticated, cartController.getCart);
router.delete('/remove/:productId', isAuthenticated, cartController.removeFromCart);
router.put('/update/:productId', isAuthenticated, cartController.updateCart);

module.exports = router;
