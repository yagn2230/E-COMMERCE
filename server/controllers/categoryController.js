const Category = require('../models/Category');

// GET all categories (with parent name populated)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name')
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('parent', 'name');
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST create new category
exports.createCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      name: name.trim(),
      parent: parent || null,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT update category
exports.updateCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        parent: parent || null,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// fecth prodcts by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID format" });
    }

    const products = await Product.find({ category: categoryId })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
}

//nested categories

exports.getNestedCategories = async (req, res) => {
  try {
    const allCategories = await Category.find().lean();

    const categoryMap = {};
    allCategories.forEach(cat => {
      cat.children = [];
      categoryMap[cat._id.toString()] = cat;
    });

    const nested = [];

    allCategories.forEach(cat => {
      if (cat.parent) {
        const parentId = cat.parent.toString();
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(cat);
        }
      } else {
        nested.push(cat);
      }
    });

    res.json(nested); // this is what your navbar expects
  } catch (err) {
    console.error("Error building nested category tree:", err);
    res.status(500).json({ message: "Server error" });
  }
};
