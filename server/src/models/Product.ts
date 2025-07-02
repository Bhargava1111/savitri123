import mongoose, { Schema, Model } from 'mongoose';
import {
  IProduct,
  IProductVariant,
  INutritionalInfo,
  IIngredient,
  IProductAttributes,
  IProductSourcing,
  IProductImage,
  IProductVideo,
  IProductSEO,
  IProductAnalytics
} from '../types/index.js';

// Product variant subdocument schema
const ProductVariantSchema = new Schema<IProductVariant>({
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    validate: {
      validator: function(v: string) {
        return /^[A-Z0-9-]+$/.test(v);
      },
      message: 'SKU must contain only uppercase letters, numbers, and hyphens'
    }
  },
  weight: {
    type: Number,
    required: true,
    min: [1, 'Weight must be at least 1 gram']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    validate: {
      validator: function(this: IProductVariant, v: number) {
        return !v || v > this.price;
      },
      message: 'Compare at price must be higher than selling price'
    }
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    required: true,
    min: [0, 'Low stock threshold cannot be negative'],
    default: 10
  },
  dimensions: {
    length: {
      type: Number,
      required: true,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      required: true,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      required: true,
      min: [0, 'Height cannot be negative']
    },
    weight: {
      type: Number,
      required: true,
      min: [0, 'Weight cannot be negative']
    }
  },
  barcode: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^\d{8,13}$/.test(v);
      },
      message: 'Barcode must be 8-13 digits'
    }
  },
  packaging: {
    type: String,
    enum: ['glass-jar', 'plastic-container', 'pouch'],
    required: true
  }
}, { _id: true });

// Nutritional info subdocument schema
const NutritionalInfoSchema = new Schema<INutritionalInfo>({
  calories: {
    type: Number,
    required: true,
    min: [0, 'Calories cannot be negative']
  },
  protein: {
    type: Number,
    required: true,
    min: [0, 'Protein cannot be negative']
  },
  carbs: {
    type: Number,
    required: true,
    min: [0, 'Carbs cannot be negative']
  },
  fat: {
    type: Number,
    required: true,
    min: [0, 'Fat cannot be negative']
  },
  fiber: {
    type: Number,
    required: true,
    min: [0, 'Fiber cannot be negative']
  },
  sodium: {
    type: Number,
    required: true,
    min: [0, 'Sodium cannot be negative']
  },
  sugar: {
    type: Number,
    required: true,
    min: [0, 'Sugar cannot be negative']
  },
  servingSize: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Ingredient subdocument schema
const IngredientSchema = new Schema<IIngredient>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100%']
  },
  allergen: {
    type: Boolean,
    default: false
  },
  organic: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Product attributes subdocument schema
const ProductAttributesSchema = new Schema<IProductAttributes>({
  spiceLevel: {
    type: Number,
    required: true,
    min: [1, 'Spice level must be at least 1'],
    max: [10, 'Spice level cannot exceed 10']
  },
  sweetness: {
    type: Number,
    required: true,
    min: [0, 'Sweetness cannot be negative'],
    max: [10, 'Sweetness cannot exceed 10']
  },
  sourness: {
    type: Number,
    required: true,
    min: [0, 'Sourness cannot be negative'],
    max: [10, 'Sourness cannot exceed 10']
  },
  saltiness: {
    type: Number,
    required: true,
    min: [0, 'Saltiness cannot be negative'],
    max: [10, 'Saltiness cannot exceed 10']
  },
  texture: {
    type: String,
    required: true,
    enum: ['smooth', 'chunky', 'coarse', 'fine', 'mixed'],
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
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
}, { _id: false });

// Product sourcing subdocument schema
const ProductSourcingSchema = new Schema<IProductSourcing>({
  origin: {
    type: String,
    required: true,
    trim: true
  },
  farmLocation: {
    type: String,
    required: true,
    trim: true
  },
  harvestDate: {
    type: Date,
    validate: {
      validator: function(v: Date) {
        return !v || v <= new Date();
      },
      message: 'Harvest date cannot be in the future'
    }
  },
  certifications: [{
    type: String,
    trim: true
  }],
  carbonFootprint: {
    type: Number,
    min: [0, 'Carbon footprint cannot be negative']
  }
}, { _id: false });

// Product image subdocument schema
const ProductImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  },
  alt: {
    type: String,
    required: true,
    trim: true
  },
  primary: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true,
    min: [0, 'Order cannot be negative']
  }
}, { _id: false });

// Product video subdocument schema
const ProductVideoSchema = new Schema<IProductVideo>({
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(mp4|mov|avi|webm)$/i.test(v) ||
               /youtube\.com|youtu\.be|vimeo\.com/.test(v);
      },
      message: 'Invalid video URL format'
    }
  },
  type: {
    type: String,
    enum: ['product-demo', 'recipe', 'making-process'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: [1, 'Duration must be at least 1 second']
  }
}, { _id: false });

// Product SEO subdocument schema
const ProductSEOSchema = new Schema<IProductSEO>({
  metaTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  openGraphImage: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(v);
      },
      message: 'Invalid Open Graph image URL format'
    }
  }
}, { _id: false });

// Product analytics subdocument schema
const ProductAnalyticsSchema = new Schema<IProductAnalytics>({
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  },
  purchases: {
    type: Number,
    default: 0,
    min: [0, 'Purchases cannot be negative']
  },
  wishlistAdds: {
    type: Number,
    default: 0,
    min: [0, 'Wishlist adds cannot be negative']
  },
  cartAdds: {
    type: Number,
    default: 0,
    min: [0, 'Cart adds cannot be negative']
  },
  conversionRate: {
    type: Number,
    default: 0,
    min: [0, 'Conversion rate cannot be negative'],
    max: [100, 'Conversion rate cannot exceed 100%']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Average rating cannot be negative'],
    max: [5, 'Average rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  }
}, { _id: false });

// Main Product schema
const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: [500, 'Short description cannot exceed 500 characters']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  brand: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Brand name cannot exceed 50 characters']
  },
  variants: {
    type: [ProductVariantSchema],
    required: true,
    validate: {
      validator: function(v: IProductVariant[]) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one variant'
    }
  },
  nutritionalInfo: {
    type: NutritionalInfoSchema,
    required: true
  },
  ingredients: {
    type: [IngredientSchema],
    required: true,
    validate: {
      validator: function(v: IIngredient[]) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one ingredient'
    }
  },
  attributes: {
    type: ProductAttributesSchema,
    required: true
  },
  sourcing: {
    type: ProductSourcingSchema,
    required: true
  },
  images: {
    type: [ProductImageSchema],
    required: true,
    validate: {
      validator: function(v: IProductImage[]) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one image'
    }
  },
  videos: {
    type: [ProductVideoSchema],
    default: []
  },
  seo: {
    type: ProductSEOSchema,
    required: true
  },
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
  analytics: {
    type: ProductAnalyticsSchema,
    default: () => ({})
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance and search
ProductSchema.index({ name: 'text', description: 'text', 'seo.keywords': 'text' });
ProductSchema.index({ slug: 1 }, { unique: true });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ status: 1, featured: 1 });
ProductSchema.index({ 'variants.price': 1 });
ProductSchema.index({ 'variants.stock': 1 });
ProductSchema.index({ 'analytics.averageRating': -1 });
ProductSchema.index({ 'analytics.purchases': -1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ 'attributes.spiceLevel': 1 });
ProductSchema.index({ 'attributes.vegan': 1 });
ProductSchema.index({ 'attributes.glutenFree': 1 });
ProductSchema.index({ seasonal: 1, 'seasonalPeriod.startMonth': 1, 'seasonalPeriod.endMonth': 1 });
ProductSchema.index({ createdAt: -1 });

// Compound indexes for complex queries
ProductSchema.index({ status: 1, category: 1, 'variants.price': 1 });
ProductSchema.index({ status: 1, 'analytics.averageRating': -1, 'analytics.reviewCount': -1 });

// Virtual fields
ProductSchema.virtual('minPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.min(...this.variants.map(v => v.price));
});

ProductSchema.virtual('maxPrice').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return Math.max(...this.variants.map(v => v.price));
});

ProductSchema.virtual('totalStock').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((total, variant) => total + variant.stock, 0);
});

ProductSchema.virtual('inStock').get(function() {
  return this.totalStock > 0;
});

ProductSchema.virtual('primaryImage').get(function() {
  if (!this.images || this.images.length === 0) return null;
  const primary = this.images.find(img => img.primary);
  return primary || this.images[0];
});

ProductSchema.virtual('discountPercentage').get(function() {
  if (!this.variants || this.variants.length === 0) return 0;
  const variant = this.variants[0];
  if (!variant.compareAtPrice || variant.compareAtPrice <= variant.price) return 0;
  return Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100);
});

// Pre-save middleware
ProductSchema.pre('save', function(next) {
  // Generate slug from name if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Ensure only one primary image
  if (this.isModified('images')) {
    const primaryImages = this.images.filter(img => img.primary);
    if (primaryImages.length > 1) {
      this.images.forEach((img, index) => {
        if (index > 0 && img.primary) {
          img.primary = false;
        }
      });
    } else if (primaryImages.length === 0 && this.images.length > 0) {
      this.images[0].primary = true;
    }
  }

  // Validate seasonal period
  if (this.seasonal && this.seasonalPeriod) {
    if (!this.seasonalPeriod.startMonth || !this.seasonalPeriod.endMonth) {
      return next(new Error('Seasonal products must have start and end months'));
    }
  }

  // Update analytics conversion rate
  if (this.analytics.views > 0) {
    this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views) * 100;
  }

  next();
});

// Instance Methods

// Check if product is in season
ProductSchema.methods.isInSeason = function(): boolean {
  if (!this.seasonal || !this.seasonalPeriod) return true;
  
  const currentMonth = new Date().getMonth() + 1;
  const { startMonth, endMonth } = this.seasonalPeriod;
  
  if (startMonth <= endMonth) {
    return currentMonth >= startMonth && currentMonth <= endMonth;
  } else {
    // Crosses year boundary
    return currentMonth >= startMonth || currentMonth <= endMonth;
  }
};

// Get variant by SKU
ProductSchema.methods.getVariantBySku = function(sku: string): IProductVariant | null {
  return this.variants.find(variant => variant.sku === sku) || null;
};

// Check stock availability for variant
ProductSchema.methods.checkStock = function(sku: string, quantity: number): boolean {
  const variant = this.getVariantBySku(sku);
  return variant ? variant.stock >= quantity : false;
};

// Update stock for variant
ProductSchema.methods.updateStock = async function(sku: string, quantity: number): Promise<boolean> {
  const variant = this.getVariantBySku(sku);
  if (!variant || variant.stock < quantity) return false;
  
  variant.stock -= quantity;
  await this.save();
  return true;
};

// Add stock for variant
ProductSchema.methods.addStock = async function(sku: string, quantity: number): Promise<void> {
  const variant = this.getVariantBySku(sku);
  if (variant) {
    variant.stock += quantity;
    await this.save();
  }
};

// Check if variant is low stock
ProductSchema.methods.isLowStock = function(sku: string): boolean {
  const variant = this.getVariantBySku(sku);
  return variant ? variant.stock <= variant.lowStockThreshold : false;
};

// Update analytics
ProductSchema.methods.incrementViews = async function(): Promise<void> {
  this.analytics.views += 1;
  if (this.analytics.purchases > 0) {
    this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views) * 100;
  }
  await this.save();
};

ProductSchema.methods.incrementPurchases = async function(): Promise<void> {
  this.analytics.purchases += 1;
  this.analytics.conversionRate = (this.analytics.purchases / this.analytics.views) * 100;
  await this.save();
};

ProductSchema.methods.incrementWishlistAdds = async function(): Promise<void> {
  this.analytics.wishlistAdds += 1;
  await this.save();
};

ProductSchema.methods.incrementCartAdds = async function(): Promise<void> {
  this.analytics.cartAdds += 1;
  await this.save();
};

// Update rating
ProductSchema.methods.updateRating = async function(newRating: number): Promise<void> {
  const currentTotal = this.analytics.averageRating * this.analytics.reviewCount;
  this.analytics.reviewCount += 1;
  this.analytics.averageRating = (currentTotal + newRating) / this.analytics.reviewCount;
  await this.save();
};

// Static Methods

// Find products with filters
ProductSchema.statics.findWithFilters = function(filters: any = {}) {
  const query: any = { status: 'active' };
  
  // Category filter
  if (filters.category) {
    query.category = filters.category;
  }
  
  // Price range filter
  if (filters.minPrice || filters.maxPrice) {
    const priceQuery: any = {};
    if (filters.minPrice) priceQuery.$gte = filters.minPrice;
    if (filters.maxPrice) priceQuery.$lte = filters.maxPrice;
    query['variants.price'] = priceQuery;
  }
  
  // Rating filter
  if (filters.rating) {
    query['analytics.averageRating'] = { $gte: filters.rating };
  }
  
  // In stock filter
  if (filters.inStock) {
    query['variants.stock'] = { $gt: 0 };
  }
  
  // Spice level filter
  if (filters.spiceLevel && filters.spiceLevel.length > 0) {
    const spiceLevels = filters.spiceLevel.map((level: string) => {
      switch (level) {
        case 'mild': return { $lte: 3 };
        case 'medium': return { $gte: 4, $lte: 6 };
        case 'hot': return { $gte: 7, $lte: 8 };
        case 'extra-hot': return { $gte: 9 };
        default: return null;
      }
    }).filter(Boolean);
    
    if (spiceLevels.length > 0) {
      query.$or = spiceLevels.map(level => ({ 'attributes.spiceLevel': level }));
    }
  }
  
  // Dietary filters
  if (filters.dietary && filters.dietary.length > 0) {
    filters.dietary.forEach((diet: string) => {
      switch (diet) {
        case 'vegan':
          query['attributes.vegan'] = true;
          break;
        case 'gluten-free':
          query['attributes.glutenFree'] = true;
          break;
        case 'diabetic-friendly':
          query['attributes.diabeticFriendly'] = true;
          break;
        case 'no-preservatives':
          query['attributes.preservatives'] = false;
          break;
      }
    });
  }
  
  return this.find(query);
};

// Get trending products
ProductSchema.statics.getTrending = function(limit: number = 10) {
  return this.find({ status: 'active' })
    .sort({ 'analytics.purchases': -1, 'analytics.views': -1 })
    .limit(limit)
    .populate('category');
};

// Get featured products
ProductSchema.statics.getFeatured = function(limit: number = 10) {
  return this.find({ status: 'active', featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('category');
};

// Get seasonal products
ProductSchema.statics.getSeasonal = function() {
  const currentMonth = new Date().getMonth() + 1;
  
  return this.find({
    status: 'active',
    seasonal: true,
    $or: [
      {
        'seasonalPeriod.startMonth': { $lte: currentMonth },
        'seasonalPeriod.endMonth': { $gte: currentMonth }
      },
      {
        'seasonalPeriod.startMonth': { $gt: 'seasonalPeriod.endMonth' },
        $or: [
          { 'seasonalPeriod.startMonth': { $lte: currentMonth } },
          { 'seasonalPeriod.endMonth': { $gte: currentMonth } }
        ]
      }
    ]
  }).populate('category');
};

// Get low stock products
ProductSchema.statics.getLowStock = function() {
  return this.find({
    status: 'active',
    'variants': {
      $elemMatch: {
        $expr: { $lte: ['$stock', '$lowStockThreshold'] }
      }
    }
  });
};

// Get product statistics
ProductSchema.statics.getProductStatistics = async function() {
  const [stats] = await this.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        activeProducts: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        featuredProducts: {
          $sum: { $cond: ['$featured', 1, 0] }
        },
        seasonalProducts: {
          $sum: { $cond: ['$seasonal', 1, 0] }
        },
        averageRating: { $avg: '$analytics.averageRating' },
        totalViews: { $sum: '$analytics.views' },
        totalPurchases: { $sum: '$analytics.purchases' }
      }
    }
  ]);
  
  return stats || {
    totalProducts: 0,
    activeProducts: 0,
    featuredProducts: 0,
    seasonalProducts: 0,
    averageRating: 0,
    totalViews: 0,
    totalPurchases: 0
  };
};

// Create the model
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;