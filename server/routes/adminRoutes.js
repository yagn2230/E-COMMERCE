const express = require("express");
const router = express.Router();

// Import controllers and middleware
const adminController = require("../controllers/adminController");
const analytics = require("../controllers/analyticsController"); // Ensure this exports the necessary functions
const isAdmin = require("../middleware/isAdmin"); // Ensure this exports a function
const authMiddleware = require("../middleware/authMiddleware"); // Ensure this exports a function

// Admin dashboard welcome route
router.get("/dashboard", isAdmin, adminController.getDashboard);

// User management
router.get("/users", isAdmin, adminController.getAllUsers);
router.get("/users/:id", isAdmin, adminController.getUserById);
router.put("/users/:id", isAdmin, adminController.updateUser);
router.delete("/users/:id", isAdmin, adminController.deleteUser);

// Product management
router.post("/products", isAdmin, adminController.createProduct);
router.get("/products", isAdmin, adminController.getAllProducts);
router.get("/products/:id", isAdmin, adminController.getProductById);
router.put("/products/:id", isAdmin, adminController.updateProduct);
router.delete("/products/:id", isAdmin, adminController.deleteProduct);

//coupon management
router.post('/coupon', isAdmin, adminController.createCoupon);
router.get('/coupons', authMiddleware, isAdmin, adminController.getAllCoupons);
router.delete('/coupon/:id', isAdmin, adminController.deleteCoupon);

//Sales report
router.get('/analytics', isAdmin, analytics.getSalesAnalytics);




module.exports = router;
