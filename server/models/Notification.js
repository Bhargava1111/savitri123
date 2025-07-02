import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Notification content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Notification type and category
  type: {
    type: String,
    enum: [
      'order_confirmed', 'order_shipped', 'order_delivered', 'order_cancelled',
      'payment_received', 'payment_failed', 'refund_processed',
      'product_back_in_stock', 'price_drop', 'new_product',
      'promotional', 'welcome', 'reminder', 'security_alert',
      'invoice_generated', 'review_request', 'loyalty_points'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['transactional', 'promotional', 'security', 'system'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Delivery channels
  channels: {
    push: {
      enabled: {
        type: Boolean,
        default: true
      },
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      clicked: {
        type: Boolean,
        default: false
      },
      clickedAt: Date,
      error: String
    },
    email: {
      enabled: {
        type: Boolean,
        default: false
      },
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      opened: {
        type: Boolean,
        default: false
      },
      openedAt: Date,
      clicked: {
        type: Boolean,
        default: false
      },
      clickedAt: Date,
      bounced: {
        type: Boolean,
        default: false
      },
      error: String
    },
    sms: {
      enabled: {
        type: Boolean,
        default: false
      },
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      error: String
    },
    whatsapp: {
      enabled: {
        type: Boolean,
        default: false
      },
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date,
      delivered: {
        type: Boolean,
        default: false
      },
      deliveredAt: Date,
      read: {
        type: Boolean,
        default: false
      },
      readAt: Date,
      error: String
    }
  },
  
  // Notification data and context
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: String,
  actionText: String,
  
  // Related entities
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  relatedInvoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice'
  },
  
  // Notification status
  status: {
    type: String,
    enum: ['pending', 'sending', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'pending'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // Scheduling
  scheduledFor: Date,
  expiresAt: Date,
  
  // Template information
  template: {
    name: String,
    version: String,
    variables: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  
  // Tracking and analytics
  analytics: {
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: Date,
    deliveryTime: Number, // milliseconds from creation to delivery
    clickThroughRate: Number,
    conversionTracked: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ category: 1, priority: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ relatedOrder: 1 });
notificationSchema.index({ read: 1, user: 1 });

// Virtual for overall delivery status
notificationSchema.virtual('isDelivered').get(function() {
  const channels = this.channels;
  return (
    (channels.push.enabled && channels.push.delivered) ||
    (channels.email.enabled && channels.email.delivered) ||
    (channels.sms.enabled && channels.sms.delivered) ||
    (channels.whatsapp.enabled && channels.whatsapp.delivered)
  );
});

// Virtual for overall success rate
notificationSchema.virtual('successRate').get(function() {
  const channels = this.channels;
  let successCount = 0;
  let totalEnabled = 0;
  
  Object.keys(channels).forEach(channel => {
    if (channels[channel].enabled) {
      totalEnabled++;
      if (channels[channel].delivered || channels[channel].sent) {
        successCount++;
      }
    }
  });
  
  return totalEnabled > 0 ? (successCount / totalEnabled) * 100 : 0;
});

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

notificationSchema.methods.markChannelAsSent = function(channel, messageId = null, error = null) {
  if (this.channels[channel]) {
    this.channels[channel].sent = !error;
    this.channels[channel].sentAt = new Date();
    if (error) {
      this.channels[channel].error = error;
    }
    if (messageId) {
      this.channels[channel].messageId = messageId;
    }
    this.analytics.attempts += 1;
    this.analytics.lastAttemptAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.markChannelAsDelivered = function(channel) {
  if (this.channels[channel]) {
    this.channels[channel].delivered = true;
    this.channels[channel].deliveredAt = new Date();
    
    // Calculate delivery time
    if (this.createdAt) {
      this.analytics.deliveryTime = new Date() - this.createdAt;
    }
    
    // Update overall status
    if (this.status === 'sending') {
      this.status = 'delivered';
    }
  }
  return this.save();
};

notificationSchema.methods.markChannelAsClicked = function(channel) {
  if (this.channels[channel]) {
    this.channels[channel].clicked = true;
    this.channels[channel].clickedAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

// Static methods
notificationSchema.statics.createOrderNotification = function(order, type, additionalData = {}) {
  const notificationData = {
    user: order.user,
    type,
    category: 'transactional',
    relatedOrder: order._id,
    data: {
      orderNumber: order.orderNumber,
      orderTotal: order.pricing.total,
      ...additionalData
    }
  };
  
  // Set title and message based on type
  switch (type) {
    case 'order_confirmed':
      notificationData.title = 'Order Confirmed!';
      notificationData.message = `Your order #${order.orderNumber} has been confirmed. Thank you for shopping with us!`;
      notificationData.actionUrl = `/orders/${order._id}`;
      notificationData.actionText = 'View Order';
      break;
    case 'order_shipped':
      notificationData.title = 'Order Shipped!';
      notificationData.message = `Your order #${order.orderNumber} has been shipped and is on its way to you.`;
      notificationData.actionUrl = `/orders/${order._id}/tracking`;
      notificationData.actionText = 'Track Order';
      break;
    case 'order_delivered':
      notificationData.title = 'Order Delivered!';
      notificationData.message = `Your order #${order.orderNumber} has been delivered. We hope you enjoy your pickles!`;
      notificationData.actionUrl = `/orders/${order._id}/review`;
      notificationData.actionText = 'Write Review';
      break;
  }
  
  return this.create(notificationData);
};

notificationSchema.statics.createProductNotification = function(userId, product, type, additionalData = {}) {
  const notificationData = {
    user: userId,
    type,
    category: type === 'promotional' ? 'promotional' : 'transactional',
    relatedProduct: product._id,
    data: {
      productName: product.name,
      productPrice: product.priceRange?.min || product.variants[0]?.price,
      ...additionalData
    }
  };
  
  switch (type) {
    case 'product_back_in_stock':
      notificationData.title = 'Back in Stock!';
      notificationData.message = `${product.name} is now back in stock. Order now before it runs out again!`;
      notificationData.actionUrl = `/products/${product.slug}`;
      notificationData.actionText = 'Shop Now';
      break;
    case 'price_drop':
      notificationData.title = 'Price Drop Alert!';
      notificationData.message = `Great news! The price of ${product.name} has dropped. Get it now at a special price!`;
      notificationData.actionUrl = `/products/${product.slug}`;
      notificationData.actionText = 'Buy Now';
      break;
  }
  
  return this.create(notificationData);
};

notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, read: false });
};

notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { user: userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
};

notificationSchema.statics.getNotificationStats = function(startDate, endDate) {
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
        _id: '$type',
        count: { $sum: 1 },
        delivered: {
          $sum: { $cond: ['$isDelivered', 1, 0] }
        },
        read: {
          $sum: { $cond: ['$read', 1, 0] }
        }
      }
    }
  ]);
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;