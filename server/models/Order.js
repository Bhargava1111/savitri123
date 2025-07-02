import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    sku: {
      type: String,
      required: true,
      uppercase: true
    },
    weight: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    packaging: {
      type: String,
      enum: ['glass-jar', 'plastic-container', 'pouch'],
      required: true
    }
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  priceAtTime: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  discountApplied: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  itemTotal: {
    type: Number,
    required: true
  }
});

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home'
  },
  name: String,
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'India'
  },
  landmark: String,
  phone: String
});

const pricingSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative']
  },
  shipping: {
    type: Number,
    required: true,
    min: [0, 'Shipping cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  appliedCoupons: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }]
});

const shippingSchema = new mongoose.Schema({
  address: {
    type: addressSchema,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['standard', 'express', 'priority', 'same-day']
  },
  provider: {
    type: String,
    enum: ['bluedart', 'delhivery', 'dtdc', 'fedex', 'ecom', 'self'],
    required: true
  },
  trackingNumber: String,
  estimatedDelivery: {
    type: Date,
    required: true
  },
  actualDelivery: Date,
  cost: {
    type: Number,
    required: true,
    min: [0, 'Shipping cost cannot be negative']
  },
  weight: Number, // Total package weight
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  }
});

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['razorpay', 'cod', 'wallet', 'netbanking', 'upi'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partial_refund'],
    default: 'pending'
  },
  transactionId: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  gateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'payu', 'cashfree']
  },
  paidAt: Date,
  failureReason: String,
  refundDetails: {
    amount: Number,
    reason: String,
    refundedAt: Date,
    refundId: String
  }
});

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String,
  automated: {
    type: Boolean,
    default: false
  }
});

const subscriptionSchema = new mongoose.Schema({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  frequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
    required: true
  },
  nextDelivery: Date,
  isActive: {
    type: Boolean,
    default: true
  }
});

const giftOrderSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true
  },
  recipientEmail: String,
  recipientPhone: String,
  message: String,
  deliveryDate: Date,
  isGiftWrapped: {
    type: Boolean,
    default: false
  },
  giftWrapCost: {
    type: Number,
    default: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Order items with variant support
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Order must have at least one item'
    }
  },
  
  // Pricing breakdown
  pricing: pricingSchema,
  
  // Shipping information
  shipping: shippingSchema,
  
  // Payment information
  payment: paymentSchema,
  
  // Order status tracking
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 'packed', 
      'shipped', 'out_for_delivery', 'delivered', 
      'cancelled', 'returned', 'refunded'
    ],
    default: 'pending'
  },
  statusHistory: [statusHistorySchema],
  
  // Special features
  subscription: subscriptionSchema,
  giftOrder: giftOrderSchema,
  
  // Business tracking
  notes: String,
  internalNotes: String,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'admin', 'api'],
    default: 'website'
  },
  
  // Delivery preferences
  deliveryInstructions: String,
  preferredTimeSlot: {
    start: String, // HH:MM format
    end: String    // HH:MM format
  },
  
  // Customer communication
  customerNotified: {
    type: Boolean,
    default: false
  },
  lastNotificationSent: Date,
  
  // Returns and exchanges
  returnEligible: {
    type: Boolean,
    default: true
  },
  returnWindow: {
    type: Number,
    default: 7 // days
  },
  returnRequested: {
    type: Boolean,
    default: false
  },
  returnDetails: {
    reason: String,
    requestedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed']
    },
    refundAmount: Number
  },
  
  // Analytics and tracking
  fraudScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  
  // Fulfillment details
  warehouse: String,
  packedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  packedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  
  // Customer feedback
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String,
  reviewedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'payment.razorpayOrderId': 1 });
orderSchema.index({ 'shipping.trackingNumber': 1 });
orderSchema.index({ 'shipping.estimatedDelivery': 1 });
orderSchema.index({ 'subscription.subscriptionId': 1 });

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for delivery status
orderSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered' && this.deliveredAt;
});

// Virtual for order value category
orderSchema.virtual('valueCategory').get(function() {
  const total = this.pricing.total;
  if (total >= 5000) return 'high';
  if (total >= 1000) return 'medium';
  return 'low';
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^PP${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `PP${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to update status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      automated: true
    });
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.itemTotal = (item.priceAtTime * item.quantity) - (item.discountApplied || 0);
  });
  
  // Calculate pricing if not set
  if (!this.pricing.subtotal) {
    this.pricing.subtotal = this.items.reduce((total, item) => total + item.itemTotal, 0);
  }
  
  if (!this.pricing.total) {
    this.pricing.total = this.pricing.subtotal + this.pricing.tax + this.pricing.shipping - this.pricing.discount;
  }
  
  next();
});

// Instance methods
orderSchema.methods.addStatusUpdate = function(status, note, updatedBy, location) {
  this.status = status;
  this.statusHistory.push({
    status,
    note,
    updatedBy,
    location,
    timestamp: new Date(),
    automated: false
  });
  
  // Update specific timestamps based on status
  switch (status) {
    case 'packed':
      this.packedAt = new Date();
      if (updatedBy) this.packedBy = updatedBy;
      break;
    case 'shipped':
      this.shippedAt = new Date();
      break;
    case 'delivered':
      this.deliveredAt = new Date();
      break;
  }
  
  return this.save();
};

orderSchema.methods.calculateRefundAmount = function() {
  let refundAmount = this.pricing.total;
  
  // Deduct shipping if already shipped
  if (['shipped', 'out_for_delivery', 'delivered'].includes(this.status)) {
    refundAmount -= this.pricing.shipping;
  }
  
  // Apply cancellation charges based on status
  switch (this.status) {
    case 'confirmed':
    case 'processing':
      // No charges
      break;
    case 'packed':
      refundAmount -= 50; // Packing charges
      break;
    case 'shipped':
      refundAmount -= 100; // Shipping charges
      break;
    default:
      refundAmount = 0; // No refund for delivered orders
  }
  
  return Math.max(0, refundAmount);
};

orderSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed', 'processing', 'packed'].includes(this.status);
};

orderSchema.methods.canBeReturned = function() {
  if (!this.returnEligible || this.status !== 'delivered') return false;
  
  const deliveryDate = this.deliveredAt || this.createdAt;
  const daysSinceDelivery = Math.floor((Date.now() - deliveryDate) / (1000 * 60 * 60 * 24));
  
  return daysSinceDelivery <= this.returnWindow;
};

orderSchema.methods.updateTrackingInfo = function(trackingNumber, provider) {
  this.shipping.trackingNumber = trackingNumber;
  this.shipping.provider = provider;
  return this.save();
};

orderSchema.methods.markAsDelivered = function(deliveredAt = new Date()) {
  this.status = 'delivered';
  this.deliveredAt = deliveredAt;
  this.shipping.actualDelivery = deliveredAt;
  
  this.statusHistory.push({
    status: 'delivered',
    timestamp: deliveredAt,
    automated: true
  });
  
  return this.save();
};

orderSchema.methods.processRefund = function(amount, reason) {
  this.payment.status = amount >= this.pricing.total ? 'refunded' : 'partial_refund';
  this.payment.refundDetails = {
    amount,
    reason,
    refundedAt: new Date(),
    refundId: `REF${Date.now()}`
  };
  
  if (amount >= this.pricing.total) {
    this.status = 'refunded';
  }
  
  return this.save();
};

// Static methods
orderSchema.statics.findByUser = function(userId, options = {}) {
  const query = this.find({ user: userId });
  
  if (options.status) {
    query.where('status').equals(options.status);
  }
  
  if (options.limit) {
    query.limit(options.limit);
  }
  
  return query.sort({ createdAt: -1 }).populate('items.product');
};

orderSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('user', 'email profile.firstName profile.lastName');
};

orderSchema.statics.findPendingOrders = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed', 'processing'] }
  }).sort({ createdAt: 1 });
};

orderSchema.statics.getOrderStats = function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        }
      }
    }
  ]);
};

orderSchema.statics.getRevenueByDay = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'delivered'
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        revenue: { $sum: '$pricing.total' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

const Order = mongoose.model('Order', orderSchema);

export default Order;