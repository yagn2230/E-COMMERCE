const mongoose = require('mongoose');
const Product = require('../models/productModel');

// Get all products (populate category info)
exports.getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'featured'
            ? { isFeatured: -1, createdAt: -1 }
            : { createdAt: -1 };

        const skip = (page - 1) * limit;

        // ✅ Filter object
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
        }

        if (req.query.brand) {
            filter.brand = { $regex: req.query.brand, $options: 'i' };
        }

        if (req.query.inStock === 'true') {
            filter.stock = { $gt: 0 };
        }

        const products = await Product.find(filter)
            .populate('category', 'name _id')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const totalCount = await Product.countDocuments(filter);

        res.status(200).json({
            products,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
        });
    } catch (error) {
        console.error('Error fetching filtered products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// serch products by name or description

exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "No search query provided" });
        }

        // Search in title or description
        const products = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Search failed", error: error.message });
    }
};


// Get related products by category
exports.listRelated = async (req, res) => {
    try {
        const { productId } = req.params;
        const limitQuery = parseInt(req.query.limit, 10);
        const limit = Number.isInteger(limitQuery) && limitQuery > 0 ? limitQuery : 8;

        // Validate productId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        // Find the main product
        const product = await Product.findById(productId).exec();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.category) {
            return res.status(400).json({ message: 'Product category not set' });
        }

        // Find related products in the same category excluding current product
        const related = await Product.find({
            category: product.category,
            _id: { $ne: productId },
        })
            .limit(limit)
            .populate('category', '_id name')
            .lean()
            .exec();

        res.json(related);
    } catch (error) {
        console.error('Error in listRelated:', error);
        res.status(500).json({ message: 'Server error fetching related products' });
    }
};

// Get single product by ID middleware (optional)
exports.productById = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid product ID format' });
    }

    try {
        const product = await Product.findById(id).populate('category').exec();

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all unique brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.status(200).json({ brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
    try {
        const { username, rating, comment } = req.body;

        if (!username || !rating || !comment) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const productId = req.params.productId;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID format' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        const newReview = { username, rating, comment };
        product.reviews.push(newReview);

        await product.save();

        res.status(201).json(product.reviews[product.reviews.length - 1]);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

