import rateLimit from 'express-rate-limit';
import { dbConnection } from '../config/database.js';
import { logger } from '../utils/logger.js';

// Create rate limiter with Redis store
const createRateLimiter = (options: {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: {
      success: false,
      error: {
        message: options.message || 'Too many requests, please try again later.',
        statusCode: 429,
        retryAfter: Math.ceil(options.windowMs / 1000)
      }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: options.skipSuccessfulRequests || false,
    skipFailedRequests: options.skipFailedRequests || false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, URL: ${req.originalUrl}`);
      res.status(429).json({
        success: false,
        error: {
          message: options.message || 'Too many requests, please try again later.',
          statusCode: 429,
          retryAfter: Math.ceil(options.windowMs / 1000)
        }
      });
    },
    // Custom key generator
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise IP
      return req.user?.userId || req.ip;
    },
    // Skip certain conditions
    skip: (req) => {
      // Skip rate limiting for admin users in development
      if (process.env.NODE_ENV === 'development' && req.user?.role === 'admin') {
        return true;
      }
      return false;
    }
  });
};

// General API rate limiter
export const apiLimiter = createRateLimiter({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window
  message: 'Too many API requests from this IP, please try again later.'
});

// Strict rate limiter for authentication endpoints
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false // Count failed requests
});

// Password reset rate limiter
export const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset attempts per hour
  message: 'Too many password reset requests, please try again later.'
});

// Contact/Support rate limiter
export const contactLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 contact attempts per hour
  message: 'Too many contact requests, please try again later.'
});

// Order creation rate limiter
export const orderLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 orders per minute
  message: 'Too many order requests, please slow down.'
});

// Review submission rate limiter
export const reviewLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // 10 reviews per day
  message: 'Too many review submissions today, please try again tomorrow.'
});

// Payment processing rate limiter
export const paymentLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 payment attempts per minute
  message: 'Too many payment requests, please wait a moment.'
});

// File upload rate limiter
export const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Too many file uploads, please try again later.'
});

// Search rate limiter (more lenient)
export const searchLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: 'Too many search requests, please slow down.'
});

// Admin operations rate limiter
export const adminLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 admin operations per minute
  message: 'Too many admin requests, please slow down.'
});

// Dynamic rate limiter based on user tier
export const createTierBasedLimiter = (options: {
  windowMs: number;
  limits: {
    guest: number;
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    admin: number;
  };
  message?: string;
}) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: (req) => {
      const user = req.user;
      if (!user) return options.limits.guest;
      
      switch (user.role) {
        case 'admin':
          return options.limits.admin;
        default:
          // For customers, check loyalty tier
          const tier = user.loyalty?.tier || 'bronze';
          return options.limits[tier as keyof typeof options.limits] || options.limits.bronze;
      }
    },
    message: {
      success: false,
      error: {
        message: options.message || 'Rate limit exceeded for your tier.',
        statusCode: 429
      }
    },
    keyGenerator: (req) => req.user?.userId || req.ip,
    handler: (req, res) => {
      const userTier = req.user?.loyalty?.tier || 'guest';
      logger.warn(`Tier-based rate limit exceeded for ${userTier} user: ${req.user?.userId || req.ip}`);
      res.status(429).json({
        success: false,
        error: {
          message: `Rate limit exceeded for ${userTier} tier. Upgrade your account for higher limits.`,
          statusCode: 429,
          tier: userTier
        }
      });
    }
  });
};

// Tier-based API limiter
export const tierApiLimiter = createTierBasedLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limits: {
    guest: 50,
    bronze: 100,
    silver: 200,
    gold: 500,
    platinum: 1000,
    admin: 10000
  },
  message: 'API rate limit exceeded for your tier.'
});

export default {
  apiLimiter,
  authLimiter,
  passwordResetLimiter,
  contactLimiter,
  orderLimiter,
  reviewLimiter,
  paymentLimiter,
  uploadLimiter,
  searchLimiter,
  adminLimiter,
  tierApiLimiter
};