const User = require('../models/User');

// ✅ GET /wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.session?.user?.id; // ✅ Corrected from _id to id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).populate('wishlist.productId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.wishlist);
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ POST /wishlist/add/:productId
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.session?.user?.id; // ✅ Corrected from _id to id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadyExists = user.wishlist.some(
      item => item.productId.toString() === productId
    );

    if (!alreadyExists) {
      user.wishlist.push({ productId });
      await user.save();
    }

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error("Add Wishlist Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ DELETE /wishlist/remove/:productId
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.session?.user?.id; 
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { productId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wishlist = user.wishlist.filter(
      item => item.productId.toString() !== productId
    );
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
