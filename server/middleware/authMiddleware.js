const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  console.log('Session:', req.session); // ✅ Still helpful

  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findById(req.session.user.id); // 👈 Fetch user from DB
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // ✅ Attach user to request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({ message: "Server error in auth middleware" });
  }
};

module.exports = authMiddleware;
