const mongoose = require('mongoose');
const slugify = require('slugify');

const dimensionsSchema = new mongoose.Schema({
  height: { type: Number, min: 0 },
  width: { type: Number, min: 0 },
  depth: { type: Number, min: 0 }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true  
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  images: [
    {
      type: String
    }
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },

  material: {
    type: String,
    trim: true
  },
  style: {
    type: String,
    trim: true
  },
  dimensions: {
    type: dimensionsSchema,
    default: {}
  },
  weight: {
    type: Number,
    min: 0
  },
  colors: [
    {
      type: String,
      trim: true
    }
  ],
  assemblyRequired: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true
    }
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {  
  timestamps: true
});

// Generate slug before saving
productSchema.pre('validate', async function(next) {
  if (this.title && !this.slug) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await mongoose.models.Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
