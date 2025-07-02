import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.js';
import User from '../models/User.js';
import { AppError } from '../types/errors.js';

const router = Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character'),
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('phone').optional().isMobilePhone('en-IN').withMessage('Please provide a valid Indian phone number')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Helper function to generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRE || '1h' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );

  return { accessToken, refreshToken };
};

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, registerValidation, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }

  const { email, password, firstName, lastName, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  // Create new user
  const user = new User({
    email,
    password,
    profile: {
      firstName,
      lastName,
      phone: phone || ''
    }
  });

  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Remove password from response
  const userResponse = user.toJSON();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: userResponse,
      accessToken,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Please provide valid email and password', 400);
  }

  const { email, password } = req.body;

  // Find user and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if account is locked
  if (user.isLocked) {
    throw new AppError('Account temporarily locked due to too many failed login attempts', 423);
  }

  // Check password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    await user.handleFailedLogin();
    throw new AppError('Invalid credentials', 401);
  }

  // Handle successful login
  await user.handleSuccessfulLogin();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id.toString());

  // Remove password from response
  const userResponse = user.toJSON();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: userResponse,
      accessToken,
      refreshToken
    }
  });
}));

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret') as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokens(user._id.toString());

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    });
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
}));

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', asyncHandler(async (req, res) => {
  // In a production app, you might want to blacklist the token
  // For now, we'll just return a success response
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   GET /api/v1/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', asyncHandler(async (req, res) => {
  // This would typically use authentication middleware
  // For demo purposes, we'll return a placeholder response
  res.json({
    success: true,
    message: 'Authentication middleware needed for this endpoint',
    data: null
  });
}));

// @route   POST /api/v1/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', passwordResetLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Please provide a valid email', 400);
  }

  const { email } = req.body;
  const user = await User.findByEmail(email);

  if (!user) {
    // Don't reveal whether user exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // In a real application, you would send an email here
  // For demo purposes, we'll just return the token (don't do this in production!)
  res.json({
    success: true,
    message: 'Password reset token generated',
    data: {
      resetToken: resetToken // Only for demo - remove in production!
    }
  });
}));

// @route   POST /api/v1/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number and special character')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Invalid input data', 400);
  }

  const { token, password } = req.body;

  // Find user by reset token
  const user = await User.findByResetToken(token);
  if (!user) {
    throw new AppError('Invalid or expired reset token', 400);
  }

  // Reset password
  user.password = password;
  user.authentication.resetPasswordToken = undefined;
  user.authentication.resetPasswordExpires = undefined;
  user.authentication.loginAttempts = 0;
  user.authentication.lockUntil = undefined;

  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
}));

// @route   GET /api/v1/auth/status
// @desc    Check authentication status
// @access  Public
router.get('/status', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Authentication service is running',
    data: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
      environment: process.env.NODE_ENV || 'development'
    }
  });
}));

export default router;