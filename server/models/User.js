import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
  isDefault: {
    type: Boolean,
    default: false
  }
});

const notificationPreferencesSchema = new mongoose.Schema({
  email: {
    type: Boolean,
    default: true
  },
  sms: {
    type: Boolean,
    default: false
  },
  whatsapp: {
    type: Boolean,
    default: false
  },
  push: {
    type: Boolean,
    default: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profile: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    avatar: {
      type: String,
      default: ''
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'other'
    }
  },
  addresses: [addressSchema],
  preferences: {
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot'],
      default: 'medium'
    },
    dietaryRestrictions: [{
      type: String,
      enum: ['vegetarian', 'vegan', 'gluten-free', 'diabetic-friendly', 'low-sodium', 'organic-only']
    }],
    favoriteCategories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }],
    language: {
      type: String,
      enum: ['en', 'hi', 'ta', 'te'],
      default: 'en'
    },
    notifications: notificationPreferencesSchema
  },
  authentication: {
    emailVerified: {
      type: Boolean,
      default: false
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
    emailVerificationToken: {
      type: String,
      select: false
    },
    phoneVerificationCode: {
      type: String,
      select: false
    },
    phoneVerificationExpires: {
      type: Date,
      select: false
    }
  },
  loyalty: {
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    referralCode: {
      type: String,
      unique: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  social: {
    googleId: String,
    facebookId: String,
    appleId: String
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'super_admin', 'support_agent'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ 'profile.phone': 1 });
userSchema.index({ 'loyalty.tier': 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'authentication.emailVerified': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`;
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.authentication.lockUntil && this.authentication.lockUntil > Date.now());
});

// Generate referral code before saving
userSchema.pre('save', async function(next) {
  if (this.isNew && !this.loyalty.referralCode) {
    this.loyalty.referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update loyalty tier based on total spent
userSchema.pre('save', function(next) {
  if (this.isModified('loyalty.totalSpent')) {
    const spent = this.loyalty.totalSpent;
    if (spent >= 50000) {
      this.loyalty.tier = 'platinum';
    } else if (spent >= 25000) {
      this.loyalty.tier = 'gold';
    } else if (spent >= 10000) {
      this.loyalty.tier = 'silver';
    } else {
      this.loyalty.tier = 'bronze';
    }
  }
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.authentication.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.authentication.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.methods.createEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.authentication.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  return verificationToken;
};

userSchema.methods.createPhoneVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.authentication.phoneVerificationCode = crypto
    .createHash('sha256')
    .update(code)
    .digest('hex');
  this.authentication.phoneVerificationExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  return code;
};

userSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.authentication.lockUntil && this.authentication.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { 'authentication.lockUntil': 1 },
      $set: { 'authentication.loginAttempts': 1 }
    });
  }
  
  const updates = { $inc: { 'authentication.loginAttempts': 1 } };
  
  // If we have max attempts and no lock, lock the account
  if (this.authentication.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { 'authentication.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: {
      'authentication.loginAttempts': 1,
      'authentication.lockUntil': 1
    }
  });
};

userSchema.methods.addLoyaltyPoints = function(points, reason = 'Purchase') {
  this.loyalty.points += points;
  
  // Log loyalty points transaction (you might want to create a separate model for this)
  console.log(`Added ${points} loyalty points to user ${this._id} for: ${reason}`);
  
  return this.save();
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findByPhone = function(phone) {
  return this.findOne({ 'profile.phone': phone });
};

userSchema.statics.findByReferralCode = function(code) {
  return this.findOne({ 'loyalty.referralCode': code.toUpperCase() });
};

const User = mongoose.model('User', userSchema);

export default User;