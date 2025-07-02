import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Detailed ratings
  detailedRatings: {
    taste: {
      type: Number,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Review metadata
  verified: {
    type: Boolean,
    default: false
  },
  helpfulCount: {
    type: Number,
    default: 0
  },
  reportCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  
  // Media attachments
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  
  // Admin moderation
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  moderationNote: String
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1, status: 1 });
reviewSchema.index({ verified: 1, status: 1 });

// Compound index to ensure one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Instance methods
reviewSchema.methods.markAsHelpful = function(userId) {
  this.helpfulCount += 1;
  return this.save();
};

reviewSchema.methods.reportReview = function(reason, reportedBy) {
  this.reportCount += 1;
  
  // Auto-hide if reported too many times
  if (this.reportCount >= 5) {
    this.status = 'hidden';
  }
  
  return this.save();
};

reviewSchema.methods.approve = function(moderatorId) {
  this.status = 'approved';
  this.moderatedBy = moderatorId;
  this.moderatedAt = new Date();
  return this.save();
};

// Static methods
reviewSchema.statics.getProductRatingStats = function(productId) {
  return this.aggregate([
    {
      $match: {
        product: mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratings: {
          $push: {
            rating: '$rating',
            detailedRatings: '$detailedRatings'
          }
        }
      }
    },
    {
      $addFields: {
        ratingDistribution: {
          $arrayToObject: {
            $map: {
              input: [1, 2, 3, 4, 5],
              as: 'rating',
              in: {
                k: { $toString: '$$rating' },
                v: {
                  $size: {
                    $filter: {
                      input: '$ratings',
                      cond: { $eq: ['$$this.rating', '$$rating'] }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
};

const Review = mongoose.model('Review', reviewSchema);

export default Review;