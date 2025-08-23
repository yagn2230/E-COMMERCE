const User = require('../models/User');
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const newUser = new User({ name, email, password, role: role || "user" });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(501).json({ message: "ERROR CREATING USER" });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        req.session.user = { id: user._id, email: user.email, role: user.role };

        console.log("Session after login:", req.session); // Debugging

        res.json({ message: "Login successful", user: req.session.user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
};
// Check Session
exports.checkSession = (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    res.status(401).json({ message: "No active session" });
};

// Logout User
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
    });
};

/// Get Shipping Address
exports.getShippingAddress = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select('shippingAddress');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ shippingAddress: user.shippingAddress || {} }); // ✅ wrap it
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch shipping address" });
  }
};


/// Update Shipping Address
exports.updateShippingAddress = async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.shippingAddress = req.body; // ✅ entire address object
    await user.save();

    res.json({
      message: "Shipping address updated successfully",
      shippingAddress: user.shippingAddress, // ✅ send updated address back
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update shipping address" });
  }
};
