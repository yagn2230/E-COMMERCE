const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");

// ✅ Make sure this route uses correct middleware order
router.get("/", wishlistController.getWishlist);
router.post("/add/:productId", wishlistController.addToWishlist);
router.delete("/remove/:productId", wishlistController.removeFromWishlist);

module.exports = router;
