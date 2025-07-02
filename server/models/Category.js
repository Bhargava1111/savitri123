import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  
  // Category hierarchy
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 0,
    min: [0, 'Level cannot be negative']
  },
  path: {
    type: String,
    default: ''
  },
  
  // Media
  image: {
    url: String,
    alt: String
  },
  icon: String,
  banner: {
    url: String,
    alt: String
  },
  
  // SEO
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    openGraphImage: String
  },
  
  // Category attributes
  attributes: {
    spiceLevelRange: {
      min: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
      },
      max: {
        type: Number,
        min: 1,
        max: 10,
        default: 10
      }
    },
    avgShelfLife: Number, // in days
    popularSeasons: [{
      type: String,
      enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter']
    }],
    region: String,
    traditionalUse: String
  },
  
  // Business logic
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  
  // Analytics
  analytics: {
    productCount: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    searches: {
      type: Number,
      default: 0
    },
    purchases: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ slug: 1 });
categorySchema.index({ parent: 1, isActive: 1 });
categorySchema.index({ level: 1, sortOrder: 1 });
categorySchema.index({ featured: 1, isActive: 1 });

// Virtual for children
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for full path
categorySchema.virtual('fullPath').get(function() {
  return this.path ? `${this.path}/${this.slug}` : this.slug;
});

// Pre-save middleware to generate slug
categorySchema.pre('save', function(next) {
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

// Pre-save middleware to set level and path
categorySchema.pre('save', async function(next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentCategory = await this.constructor.findById(this.parent);
      if (parentCategory) {
        this.level = parentCategory.level + 1;
        this.path = parentCategory.fullPath;
      }
    } else {
      this.level = 0;
      this.path = '';
    }
  }
  next();
});

// Instance methods
categorySchema.methods.getAncestors = async function() {
  const ancestors = [];
  let current = this;
  
  while (current.parent) {
    const parent = await this.constructor.findById(current.parent);
    if (parent) {
      ancestors.unshift(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return ancestors;
};

categorySchema.methods.getDescendants = async function() {
  const descendants = [];
  
  const findChildren = async (categoryId) => {
    const children = await this.constructor.find({ parent: categoryId });
    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };
  
  await findChildren(this._id);
  return descendants;
};

categorySchema.methods.incrementView = function() {
  this.analytics.views += 1;
  return this.save();
};

categorySchema.methods.incrementSearch = function() {
  this.analytics.searches += 1;
  return this.save();
};

// Static methods
categorySchema.statics.findRootCategories = function() {
  return this.find({ parent: null, isActive: true }).sort({ sortOrder: 1, name: 1 });
};

categorySchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true }).sort({ sortOrder: 1 });
};

categorySchema.statics.buildTree = async function() {
  const categories = await this.find({ isActive: true }).sort({ level: 1, sortOrder: 1 });
  const tree = [];
  const categoryMap = {};
  
  // Create a map for quick lookup
  categories.forEach(category => {
    categoryMap[category._id] = { ...category.toObject(), children: [] };
  });
  
  // Build the tree
  categories.forEach(category => {
    if (category.parent) {
      const parent = categoryMap[category.parent];
      if (parent) {
        parent.children.push(categoryMap[category._id]);
      }
    } else {
      tree.push(categoryMap[category._id]);
    }
  });
  
  return tree;
};

const Category = mongoose.model('Category', categorySchema);

export default Category;