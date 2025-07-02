import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot', 'agent'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: [2000, 'Message content cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['text', 'image', 'audio', 'quick_reply', 'carousel', 'button', 'file'],
    default: 'text'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    intent: String,
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    entities: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    suggestions: [String],
    attachments: [{
      type: String,
      url: String,
      size: Number
    }],
    quickReplies: [{
      text: String,
      payload: String
    }],
    carousel: [{
      title: String,
      subtitle: String,
      imageUrl: String,
      buttons: [{
        type: String,
        title: String,
        payload: String,
        url: String
      }]
    }]
  },
  readAt: Date,
  delivered: {
    type: Boolean,
    default: false
  },
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
});

const contextSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true
  },
  entities: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  currentStep: String,
  conversationFlow: {
    type: String,
    enum: ['greeting', 'product_inquiry', 'order_status', 'complaint', 'recommendation', 'support', 'checkout_assistance'],
    default: 'greeting'
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te'],
    default: 'en'
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  lastIntentAt: {
    type: Date,
    default: Date.now
  }
});

const userPreferencesSchema = new mongoose.Schema({
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot']
  },
  favoriteProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  priceRange: {
    min: {
      type: Number,
      min: 0
    },
    max: {
      type: Number,
      min: 0
    }
  },
  dietaryRestrictions: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'diabetic-friendly', 'low-sodium', 'organic-only']
  }],
  preferredCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  lastSearchQueries: [String],
  purchaseHistory: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    purchaseDate: Date,
    frequency: Number
  }]
});

const aiDataSchema = new mongoose.Schema({
  userPreferences: userPreferencesSchema,
  conversationSummary: String,
  resolvedIssues: [String],
  escalationReasons: [String],
  knowledgeGaps: [String],
  learningPoints: [{
    topic: String,
    accuracy: Number,
    timestamp: Date
  }],
  personalityProfile: {
    communicationStyle: {
      type: String,
      enum: ['formal', 'casual', 'friendly', 'technical']
    },
    responseLength: {
      type: String,
      enum: ['brief', 'moderate', 'detailed']
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 10
    }
  }
});

const resolutionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['self_service', 'bot_resolved', 'agent_resolved', 'escalated'],
    required: true
  },
  summary: String,
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedbackText: String,
  resolutionTime: Number, // in minutes
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date
});

const chatConversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  customerInfo: {
    name: String,
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: String,
    isGuest: {
      type: Boolean,
      default: false
    }
  },
  
  // Conversation context
  context: contextSchema,
  
  // Message history
  messages: {
    type: [messageSchema],
    default: []
  },
  
  // Bot intelligence
  aiData: aiDataSchema,
  
  // Status tracking
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'abandoned', 'paused'],
    default: 'active'
  },
  escalatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Agent ID
  },
  escalatedAt: Date,
  resolution: resolutionSchema,
  
  // Analytics
  analytics: {
    totalMessages: {
      type: Number,
      default: 0
    },
    userMessages: {
      type: Number,
      default: 0
    },
    botMessages: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number, // in seconds
    sessionDuration: Number, // in minutes
    bounceRate: {
      type: Boolean,
      default: false
    }, // User left after first message
    conversionGoals: [{
      type: String,
      achieved: Boolean,
      timestamp: Date
    }]
  },
  
  // Business context
  relatedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  tags: [String],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Technical details
  channel: {
    type: String,
    enum: ['website', 'mobile_app', 'whatsapp', 'facebook', 'telegram'],
    default: 'website'
  },
  deviceInfo: {
    userAgent: String,
    ipAddress: String,
    location: {
      country: String,
      state: String,
      city: String
    }
  },
  
  // Quality assurance
  qualityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  manualReview: {
    required: {
      type: Boolean,
      default: false
    },
    completed: {
      type: Boolean,
      default: false
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    notes: String
  },
  
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
chatConversationSchema.index({ sessionId: 1 });
chatConversationSchema.index({ user: 1, createdAt: -1 });
chatConversationSchema.index({ status: 1, lastActivity: -1 });
chatConversationSchema.index({ escalatedTo: 1, escalatedAt: -1 });
chatConversationSchema.index({ 'context.intent': 1 });
chatConversationSchema.index({ 'context.language': 1 });
chatConversationSchema.index({ channel: 1, createdAt: -1 });

// Virtual for conversation duration
chatConversationSchema.virtual('duration').get(function() {
  if (this.messages.length < 2) return 0;
  
  const startTime = this.messages[0].timestamp;
  const endTime = this.messages[this.messages.length - 1].timestamp;
  
  return Math.floor((endTime - startTime) / (1000 * 60)); // in minutes
});

// Virtual for response time
chatConversationSchema.virtual('averageResponseTime').get(function() {
  if (this.messages.length < 2) return 0;
  
  let totalResponseTime = 0;
  let responseCount = 0;
  
  for (let i = 1; i < this.messages.length; i++) {
    const currentMessage = this.messages[i];
    const previousMessage = this.messages[i - 1];
    
    if (currentMessage.sender === 'bot' && previousMessage.sender === 'user') {
      const responseTime = currentMessage.timestamp - previousMessage.timestamp;
      totalResponseTime += responseTime;
      responseCount++;
    }
  }
  
  return responseCount > 0 ? Math.floor(totalResponseTime / responseCount / 1000) : 0; // in seconds
});

// Virtual for user satisfaction
chatConversationSchema.virtual('userSatisfied').get(function() {
  return this.resolution && this.resolution.satisfactionRating >= 4;
});

// Pre-save middleware to update analytics
chatConversationSchema.pre('save', function(next) {
  if (this.isModified('messages')) {
    this.analytics.totalMessages = this.messages.length;
    this.analytics.userMessages = this.messages.filter(m => m.sender === 'user').length;
    this.analytics.botMessages = this.messages.filter(m => m.sender === 'bot').length;
    
    // Update bounce rate
    if (this.analytics.userMessages === 1 && this.analytics.botMessages >= 1) {
      this.analytics.bounceRate = true;
    }
    
    // Update last activity
    this.lastActivity = new Date();
  }
  next();
});

// Pre-save middleware to generate session summary
chatConversationSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved') {
    // Generate conversation summary
    const userMessages = this.messages.filter(m => m.sender === 'user');
    const mainTopics = userMessages.map(m => m.metadata?.intent).filter(Boolean);
    
    this.aiData.conversationSummary = `Conversation about ${[...new Set(mainTopics)].join(', ')} with ${this.analytics.totalMessages} messages over ${this.duration} minutes.`;
  }
  next();
});

// Instance methods
chatConversationSchema.methods.addMessage = function(sender, content, type = 'text', metadata = {}) {
  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newMessage = {
    id: messageId,
    sender,
    content,
    type,
    metadata,
    timestamp: new Date(),
    delivered: true
  };
  
  this.messages.push(newMessage);
  this.lastActivity = new Date();
  
  return this.save();
};

chatConversationSchema.methods.updateContext = function(intent, entities, sentiment, confidence) {
  this.context.intent = intent;
  this.context.entities = { ...this.context.entities, ...entities };
  this.context.sentiment = sentiment;
  this.context.confidence = confidence;
  this.context.lastIntentAt = new Date();
  
  return this.save();
};

chatConversationSchema.methods.escalateToAgent = function(reason, agentId) {
  this.status = 'escalated';
  this.escalatedTo = agentId;
  this.escalatedAt = new Date();
  this.aiData.escalationReasons.push(reason);
  
  return this.save();
};

chatConversationSchema.methods.resolveConversation = function(type, summary, rating, feedback) {
  this.status = 'resolved';
  this.resolution = {
    type,
    summary,
    satisfactionRating: rating,
    feedbackText: feedback,
    resolutionTime: this.duration
  };
  
  return this.save();
};

chatConversationSchema.methods.markAsAbandoned = function() {
  // Mark as abandoned if inactive for more than 30 minutes
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  if (this.lastActivity < thirtyMinutesAgo && this.status === 'active') {
    this.status = 'abandoned';
    return this.save();
  }
  
  return Promise.resolve(this);
};

chatConversationSchema.methods.updateUserPreferences = function(preferences) {
  this.aiData.userPreferences = {
    ...this.aiData.userPreferences,
    ...preferences
  };
  
  return this.save();
};

chatConversationSchema.methods.addRelatedOrder = function(orderId) {
  if (!this.relatedOrders.includes(orderId)) {
    this.relatedOrders.push(orderId);
    return this.save();
  }
  
  return Promise.resolve(this);
};

chatConversationSchema.methods.addRelatedProduct = function(productId) {
  if (!this.relatedProducts.includes(productId)) {
    this.relatedProducts.push(productId);
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Static methods
chatConversationSchema.statics.findActiveConversations = function() {
  return this.find({ status: 'active' }).sort({ lastActivity: -1 });
};

chatConversationSchema.statics.findByUser = function(userId) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

chatConversationSchema.statics.findPendingEscalations = function() {
  return this.find({ 
    status: 'escalated',
    escalatedTo: { $exists: true }
  }).populate('escalatedTo', 'profile.firstName profile.lastName');
};

chatConversationSchema.statics.getConversationStats = function(startDate, endDate) {
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
        totalConversations: { $sum: 1 },
        resolvedByBot: {
          $sum: { $cond: [{ $eq: ['$resolution.type', 'bot_resolved'] }, 1, 0] }
        },
        escalatedToAgent: {
          $sum: { $cond: [{ $eq: ['$status', 'escalated'] }, 1, 0] }
        },
        averageSatisfaction: { $avg: '$resolution.satisfactionRating' },
        averageDuration: { $avg: '$analytics.sessionDuration' }
      }
    }
  ]);
};

chatConversationSchema.statics.getIntentAnalytics = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$context.intent',
        count: { $sum: 1 },
        averageConfidence: { $avg: '$context.confidence' },
        resolutionRate: {
          $avg: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

chatConversationSchema.statics.markAbandonedConversations = async function() {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  
  return this.updateMany(
    {
      status: 'active',
      lastActivity: { $lt: thirtyMinutesAgo }
    },
    {
      $set: { status: 'abandoned' }
    }
  );
};

const ChatConversation = mongoose.model('ChatConversation', chatConversationSchema);

export default ChatConversation;