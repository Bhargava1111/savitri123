import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  weight: {
    type: Number,
    required: true, // in grams
    min: [1, 'Weight must be at least 1 gram']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare price cannot be negative']
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  dimensions: {
    length: Number, // in cm
    width: Number,  // in cm
    height: Number, // in cm
    weight: Number  // in grams (packaging weight)
  },
  barcode: String,
  packaging: {
    type: String,
    enum: ['glass-jar', 'plastic-container', 'pouch'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const nutritionalInfoSchema = new mongoose.Schema({
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    min: [0, 'Protein cannot be negative']
  },
  carbs: {
    type: Number,
    min: [0, 'Carbohydrates cannot be negative']
  },
  fat: {
    type: Number,
    min: [0, 'Fat cannot be negative']
  },
  fiber: {
    type: Number,
    min: [0, 'Fiber cannot be negative']
  },
  sodium: {
    type: Number,
    min: [0, 'Sodium cannot be negative']
  },
  sugar: {
    type: Number,
    min: [0, 'Sugar cannot be negative']
  },
  servingSize: {
    type: String,
    required: true
  }
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  allergen: {
    type: Boolean,
    default: false
  },
  organic: {
    type: Boolean,
    default: false
  }
});

const attributesSchema = new mongoose.Schema({
  spiceLevel: {
    type: Number,
    min: [1, 'Spice level must be between 1-10'],
    max: [10, 'Spice level must be between 1-10'],
    required: true
  },
  sweetness: {
    type: Number,
    min: [1, 'Sweetness level must be between 1-10'],
    max: [10, 'Sweetness level must be between 1-10'],
    default: 5
  },
  sourness: {
    type: Number,
    min: [1, 'Sourness level must be between 1-10'],
    max: [10, 'Sourness level must be between 1-10'],
    default: 5
  },
  saltiness: {
    type: Number,
    min: [1, 'Saltiness level must be between 1-10'],
    max: [10, 'Saltiness level must be between 1-10'],
    default: 5
  },
  texture: {
    type: String,
    enum: ['chunky', 'smooth', 'mixed', 'crispy', 'tender']
  },
  color: String,
  preservatives: {
    type: Boolean,
    default: false
  },
  vegan: {
    type: Boolean,
    default: true
  },
  glutenFree: {
    type: Boolean,
    default: true
  },
  diabeticFriendly: {
    type: Boolean,
    default: false
  }
});

const sourcingSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true
  },
  farmLocation: String,
  harvestDate: Date,
  certifications: [{
    type: String,
    enum: ['organic', 'fair-trade', 'non-gmo', 'kosher', 'halal']
  }],
  carbonFootprint: Number // in kg CO2
});

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  primary: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
});

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['product-demo', 'recipe', 'making-process'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  duration: Number // in seconds
});

const seoSchema = new mongoose.Schema({
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  openGraphImage: String
});

const analyticsSchema = new mongoose.Schema({
  views: {
    type: Number,
    default: 0
  },
  purchases: {
    type: Number,
    default: 0
  },
  wishlistAdds: {
    type: Number,
    default: 0
  },
  cartAdds: {
    type: Number,
    default: 0
  },
  conversionRate: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  
  // Multi-variant system
  variants: {
    type: [variantSchema],
    required: true,
    validate: {
      validator: function(variants) {
        return variants && variants.length > 0;
      },
      message: 'Product must have at least one variant'
    }
  },
  
  // Advanced product information
  nutritionalInfo: nutritionalInfoSchema,
  ingredients: {
    type: [ingredientSchema],
    required: true
  },
  attributes: attributesSchema,
  sourcing: sourcingSchema,
  
  // Media and content
  images: {
    type: [imageSchema],
    required: true,
    validate: {
      validator: function(images) {
        return images && images.length > 0;
      },
      message: 'Product must have at least one image'
    }
  },
  videos: [videoSchema],
  
  // SEO and marketing
  seo: seoSchema,
  
  // Business logic
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  seasonal: {
    type: Boolean,
    default: false
  },
  seasonalPeriod: {
    startMonth: {
      type: Number,
      min: [1, 'Start month must be between 1-12'],
      max: [12, 'Start month must be between 1-12']
    },
    endMonth: {
      type: Number,
      min: [1, 'End month must be between 1-12'],
      max: [12, 'End month must be between 1-12']
    }
  },
  
  // Analytics tracking
  analytics: analyticsSchema,
  
  // Additional metadata
  tags: [String],
  recipeIdeas: [String],
  shelfLife: {
    duration: Number, // in days
    unit: {
      type: String,
      enum: ['days', 'months', 'years'],
      default: 'days'
    }
  },
  storageInstructions: String,
  servingSuggestions: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'analytics.averageRating': -1 });
productSchema.index({ 'variants.price': 1 });
productSchema.index({ 'variants.stock': 1 });
productSchema.index({ featured: 1, createdAt: -1 });
productSchema.index({ seasonal: 1, 'seasonalPeriod.startMonth': 1 });
productSchema.index({ slug: 1 });
productSchema.index({ 'attributes.spiceLevel': 1 });
productSchema.index({ 'attributes.vegan': 1 });
productSchema.index({ 'attributes.glutenFree': 1 });

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.primary);
  return primary || this.images[0];
});

// Virtual for price range
productSchema.virtual('priceRange').get(function() {
  if (!this.variants || this.variants.length === 0) return null;
  
  const prices = this.variants.map(v => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  
  return { min, max };
});

// Virtual for total stock
productSchema.virtual('totalStock').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  
  return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  if (!this.variants || this.variants.length === 0) return false;
  
  return this.variants.some(variant => variant.stock <= variant.lowStockThreshold);
});

// Virtual for discount percentage
productSchema.virtual('maxDiscount').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  
  let maxDiscount = 0;
  this.variants.forEach(variant => {
    if (variant.compareAtPrice && variant.compareAtPrice > variant.price) {
      const discount = ((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100;
      maxDiscount = Math.max(maxDiscount, discount);
    }
  });
  
  return Math.round(maxDiscount);
});

// Pre-save middleware to generate slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

// Pre-save middleware to update analytics
productSchema.pre('save', function(next) {
  if (this.isModified('analytics.reviewCount') || this.isModified('analytics.purchases')) {
    // Recalculate conversion rate
    if (this.analytics.views > 0) {
      this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views) * 100;
    }
  }
  next();
});

// Instance methods
productSchema.methods.incrementView = function() {
  this.analytics.views += 1;
  return this.save();
};

productSchema.methods.incrementPurchase = function() {
  this.analytics.purchases += 1;
  return this.save();
};

productSchema.methods.incrementWishlist = function() {
  this.analytics.wishlistAdds += 1;
  return this.save();
};

productSchema.methods.incrementCartAdd = function() {
  this.analytics.cartAdds += 1;
  return this.save();
};

productSchema.methods.updateRating = function(newRating, isNewReview = true) {
  if (isNewReview) {
    const totalRating = this.analytics.averageRating * this.analytics.reviewCount + newRating;
    this.analytics.reviewCount += 1;
    this.analytics.averageRating = totalRating / this.analytics.reviewCount;
  } else {
    // Handle rating update (would need previous rating)
    // This is a simplified version
    this.analytics.averageRating = newRating;
  }
  
  return this.save();
};

productSchema.methods.getVariantBySku = function(sku) {
  return this.variants.find(variant => variant.sku === sku.toUpperCase());
};

productSchema.methods.updateStock = function(sku, quantity) {
  const variant = this.getVariantBySku(sku);
  if (variant) {
    variant.stock += quantity;
    return this.save();
  }
  throw new Error('Variant not found');
};

productSchema.methods.checkStock = function(sku, requestedQuantity) {
  const variant = this.getVariantBySku(sku);
  if (!variant) {
    throw new Error('Variant not found');
  }
  
  return variant.stock >= requestedQuantity;
};

// Static methods
productSchema.statics.findByCategory = function(categoryId) {
  return this.find({ category: categoryId, status: 'active' });
};

productSchema.statics.findFeatured = function() {
  return this.find({ featured: true, status: 'active' });
};

productSchema.statics.findSeasonal = function() {
  const currentMonth = new Date().getMonth() + 1;
  return this.find({
    seasonal: true,
    status: 'active',
    $or: [
      {
        'seasonalPeriod.startMonth': { $lte: currentMonth },
        'seasonalPeriod.endMonth': { $gte: currentMonth }
      },
      {
        'seasonalPeriod.startMonth': { $gt: currentMonth },
        'seasonalPeriod.endMonth': { $lt: currentMonth }
      }
    ]
  });
};

productSchema.statics.searchProducts = function(query, filters = {}) {
  const searchCriteria = {
    status: 'active',
    ...filters
  };
  
  if (query) {
    searchCriteria.$text = { $search: query };
  }
  
  return this.find(searchCriteria);
};

const Product = mongoose.model('Product', productSchema);

export default Product;