import mongoose, { Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUser, IAddress, IUserPreferences, IUserAuthentication, IUserLoyalty, IUserSocial } from '../types/index.js';

// Address subdocument schema
const AddressSchema = new Schema<IAddress>({
  type: {
    type: String,
    enum: ['home', 'work', 'other'],
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: 'Invalid phone number format'
    }
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true
  },
  addressLine2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'India',
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^\d{6}$/.test(v);
      },
      message: 'Invalid pincode format'
    }
  },
  landmark: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  _id: true,
  timestamps: true
});

// User preferences subdocument schema
const UserPreferencesSchema = new Schema<IUserPreferences>({
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot'],
    default: 'medium'
  },
  dietaryRestrictions: [{
    type: String,
    trim: true
  }],
  favoriteCategories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  language: {
    type: String,
    enum: ['en', 'hi', 'ta', 'te'],
    default: 'en'
  },
  notifications: {
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
  }
}, { _id: false });

// Authentication subdocument schema
const UserAuthenticationSchema = new Schema<IUserAuthentication>({
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
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  emailVerificationToken: {
    type: String
  },
  phoneVerificationCode: {
    type: String
  }
}, { _id: false });

// Loyalty subdocument schema
const UserLoyaltySchema = new Schema<IUserLoyalty>({
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  tierUpgradeDate: {
    type: Date
  },
  pointsHistory: [{
    points: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['earned', 'redeemed'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, { _id: false });

// Social authentication subdocument schema
const UserSocialSchema = new Schema<IUserSocial>({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  appleId: {
    type: String,
    unique: true,
    sparse: true
  }
}, { _id: false });

// Main User schema
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: function(this: IUser) {
      // Password not required if social login
      return !this.social.googleId && !this.social.facebookId && !this.social.appleId;
    },
    minlength: 8,
    validate: {
      validator: function(v: string) {
        // Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
      },
      message: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character'
    }
  },
  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    phone: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^[6-9]\d{9}$/.test(v);
        },
        message: 'Invalid phone number format'
      }
    },
    avatar: {
      type: String,
      default: null
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function(v: Date) {
          return !v || v < new Date();
        },
        message: 'Date of birth must be in the past'
      }
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other']
    }
  },
  addresses: [AddressSchema],
  preferences: {
    type: UserPreferencesSchema,
    default: () => ({})
  },
  authentication: {
    type: UserAuthenticationSchema,
    default: () => ({})
  },
  loyalty: {
    type: UserLoyaltySchema,
    default: () => ({})
  },
  social: {
    type: UserSocialSchema,
    default: () => ({})
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'moderator'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.authentication.resetPasswordToken;
      delete ret.authentication.emailVerificationToken;
      delete ret.authentication.phoneVerificationCode;
      return ret;
    }
  }
});

// Indexes for performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'profile.phone': 1 });
UserSchema.index({ 'social.googleId': 1 }, { sparse: true });
UserSchema.index({ 'social.facebookId': 1 }, { sparse: true });
UserSchema.index({ 'social.appleId': 1 }, { sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ 'loyalty.tier': 1 });
UserSchema.index({ createdAt: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.profile.firstName} ${this.profile.lastName}`.trim();
});

// Virtual for account lock status
UserSchema.virtual('isLocked').get(function() {
  return !!(this.authentication.lockUntil && this.authentication.lockUntil > new Date());
});

// Pre-save middleware for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  if (this.password) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  
  next();
});

// Pre-save middleware for ensuring only one default address
UserSchema.pre('save', function(next) {
  if (this.isModified('addresses')) {
    const defaultAddresses = this.addresses.filter(addr => addr.isDefault);
    if (defaultAddresses.length > 1) {
      // Keep only the first default address
      this.addresses.forEach((addr, index) => {
        if (index > 0 && addr.isDefault) {
          addr.isDefault = false;
        }
      });
    }
  }
  next();
});

// Instance Methods

// Compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.authentication.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.authentication.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  return resetToken;
};

// Generate email verification token
UserSchema.methods.generateEmailVerificationToken = function(): string {
  const verificationToken = crypto.randomBytes(32).toString('hex');
  this.authentication.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  return verificationToken;
};

// Handle failed login attempt
UserSchema.methods.handleFailedLogin = async function(): Promise<void> {
  this.authentication.loginAttempts += 1;
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.authentication.loginAttempts >= 5) {
    this.authentication.lockUntil = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  }
  
  await this.save();
};

// Handle successful login
UserSchema.methods.handleSuccessfulLogin = async function(): Promise<void> {
  if (this.authentication.loginAttempts > 0 || this.authentication.lockUntil) {
    this.authentication.loginAttempts = 0;
    this.authentication.lockUntil = undefined;
  }
  this.authentication.lastLogin = new Date();
  await this.save();
};

// Add loyalty points
UserSchema.methods.addLoyaltyPoints = async function(points: number, description: string): Promise<void> {
  this.loyalty.points += points;
  this.loyalty.pointsHistory.push({
    points,
    type: 'earned',
    description,
    date: new Date()
  });
  
  // Update tier based on total points
  this.updateLoyaltyTier();
  await this.save();
};

// Redeem loyalty points
UserSchema.methods.redeemLoyaltyPoints = async function(points: number, description: string): Promise<boolean> {
  if (this.loyalty.points < points) {
    return false;
  }
  
  this.loyalty.points -= points;
  this.loyalty.pointsHistory.push({
    points: -points,
    type: 'redeemed',
    description,
    date: new Date()
  });
  
  await this.save();
  return true;
};

// Update loyalty tier
UserSchema.methods.updateLoyaltyTier = function(): void {
  const totalSpent = this.loyalty.totalSpent;
  let newTier: 'bronze' | 'silver' | 'gold' | 'platinum' = 'bronze';
  
  if (totalSpent >= 100000) { // ₹1,00,000
    newTier = 'platinum';
  } else if (totalSpent >= 50000) { // ₹50,000
    newTier = 'gold';
  } else if (totalSpent >= 25000) { // ₹25,000
    newTier = 'silver';
  }
  
  if (newTier !== this.loyalty.tier) {
    this.loyalty.tier = newTier;
    this.loyalty.tierUpgradeDate = new Date();
  }
};

// Get default address
UserSchema.methods.getDefaultAddress = function(): IAddress | null {
  return this.addresses.find(addr => addr.isDefault) || null;
};

// Add address
UserSchema.methods.addAddress = function(addressData: Partial<IAddress>): void {
  // If this is the first address or explicitly set as default, make it default
  if (this.addresses.length === 0 || addressData.isDefault) {
    // Remove default from other addresses
    this.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  this.addresses.push(addressData as IAddress);
};

// Static Methods

// Find by email
UserSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

// Find by reset token
UserSchema.statics.findByResetToken = function(token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    'authentication.resetPasswordToken': hashedToken,
    'authentication.resetPasswordExpires': { $gt: new Date() }
  });
};

// Find by verification token
UserSchema.statics.findByVerificationToken = function(token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return this.findOne({
    'authentication.emailVerificationToken': hashedToken
  });
};

// Get user statistics
UserSchema.statics.getUserStatistics = async function() {
  const [stats] = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        verifiedUsers: {
          $sum: { $cond: ['$authentication.emailVerified', 1, 0] }
        },
        socialUsers: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $ne: ['$social.googleId', null] },
                  { $ne: ['$social.facebookId', null] },
                  { $ne: ['$social.appleId', null] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        verifiedUsers: 1,
        socialUsers: 1,
        verificationRate: {
          $multiply: [
            { $divide: ['$verifiedUsers', '$totalUsers'] },
            100
          ]
        }
      }
    }
  ]);
  
  return stats || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    socialUsers: 0,
    verificationRate: 0
  };
};

// Create the model
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;