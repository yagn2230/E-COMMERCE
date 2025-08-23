const User = require('../models/User');
const Product = require('../models/productModel');

// Add product to cart
const addToCart = async (req, res) => {
  const userId = req.session.user?.id;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity) || 1; // ✅ typo fixed from "quantcity" to "quantity"

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const existingItem = user.cart.find(item => item.productId.toString() === productId);

    const existingQuantity = existingItem ? existingItem.quantity : 0;
    const newTotalQuantity = existingQuantity + quantity;

    if (newTotalQuantity > product.stock) {
      return res.status(400).json({
        message: `Cannot add ${quantity} item(s). Only ${product.stock - existingQuantity} left in stock.`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newTotalQuantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Get all cart items
const getCart = async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user.cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart', error: err.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const userId = req.session.user?.id;
  const productId = req.params.productId;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();

    res.status(200).json({ message: 'Product removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from cart', error: err.message });
  }
};

// Update quantity of a product in cart
const updateCart = async (req, res) => {
  const userId = req.session.user?.id;
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!quantity || quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const item = user.cart.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not found in cart' });

    item.quantity = quantity;
    await user.save();

    res.status(200).json({ message: 'Cart updated', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
};
