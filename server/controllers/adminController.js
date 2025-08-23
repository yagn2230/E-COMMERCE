const bcrypt = require("bcrypt");
const User = require("../models/User");
const Product = require("../models/productModel");
const Category = require("../models/Category");
const Coupon = require("../models/Coupon");

// 🟩 GET: Dashboard
exports.getDashboard = (req, res) => {
  res.json({ message: "Welcome to the admin dashboard." });
};

// 🟦 GET: All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟦 GET: User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Fetch user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟨 PUT: Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updates = { name, email };

    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟥 DELETE: User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟧 POST: Create Product
exports.createProduct = async (req, res) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only admin can create products" });
    }

    const {
      title,
      description,
      brand,
      price,
      images,
      category,
      material,
      style,
      dimensions,
      weight,
      colors,
      assemblyRequired,
      stock,
      tags,
      slug // Allow custom slug
    } = req.body;

    if (!title || !price?.amount || !category) {
      return res.status(400).json({ message: "Title, price amount, and category are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    // If custom slug is provided, check for uniqueness
    if (slug) {
      const existing = await Product.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: "Slug already exists. Please choose another." });
      }
    }

    const newProduct = new Product({
      title,
      description,
      brand,
      price: {
        amount: price.amount,
        currency: price.currency || "USD",
      },
      images,
      category,
      material,
      style,
      dimensions,
      weight,
      colors,
      assemblyRequired,
      stock,
      tags,
      user: req.session.user.id,
      slug // Pass custom slug if provided
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 🟧 PUT: Update Product
exports.updateProduct = async (req, res) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only admin can update products" });
    }

    const {
      title,
      description,
      brand,
      price,
      images,
      category,
      material,
      style,
      dimensions,
      weight,
      colors,
      assemblyRequired,
      stock,
      tags,
      isActive,
      slug // Allow updating slug
    } = req.body;

    if (!title || !price?.amount || !category) {
      return res.status(400).json({ message: "Title, price amount, and category are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // If slug is being updated and is different, check for uniqueness
    if (slug && slug !== product.slug) {
      const existing = await Product.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: "Slug already exists. Please choose another." });
      }
      product.slug = slug;
    }

    // Update fields
    Object.assign(product, {
      title,
      description,
      brand,
      price: {
        amount: price.amount,
        currency: price.currency || "USD",
      },
      images,
      category,
      material,
      style,
      dimensions,
      weight,
      colors,
      assemblyRequired,
      stock,
      tags,
      isActive,
    });

    await product.save();

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 🟨 GET: All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 🟨 GET: Product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


// 🟥 DELETE: Product
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const user = await User.findById(req.session.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Only admin can delete products" });
    }

    let product;
    // Support deleting by slug or ID
    if (req.params.slug) {
      product = await Product.findOneAndDelete({ slug: req.params.slug });
    } else if (req.params.id) {
      product = await Product.findByIdAndDelete(req.params.id);
    }

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// 🎟️ POST: Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.status(201).json(newCoupon);
  } catch (err) {
    console.error("Create coupon error:", err);
    res.status(400).json({ error: err.message });
  }
};

// 🎟️ GET: All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error("Fetch coupons error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🎟️ DELETE: Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: "Coupon deleted" });
  } catch (err) {
    console.error("Delete coupon error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
