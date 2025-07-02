import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { AppError } from '../types/errors.js';

// Development error response
const sendErrorDev = (err: any, res: Response) => {
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
      name: err.name,
      code: err.code
    }
  });
};

// Production error response
const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode || 500
      }
    });
  } else {
    // Programming or other unknown errors: don't leak details
    logger.error('Unknown error:', err);
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong on our end. Please try again later.',
        statusCode: 500
      }
    });
  }
};

// Handle MongoDB cast errors
const handleCastErrorDB = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle MongoDB duplicate field errors
const handleDuplicateFieldsDB = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationErrorDB = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again.', 401);
};

const handleJWTExpiredError = (): AppError => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

// Handle rate limit errors
const handleRateLimitError = (): AppError => {
  return new AppError('Too many requests. Please try again later.', 429);
};

// Global error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  const errorLog = {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.userId || 'anonymous',
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    logger.error('Error Details:', errorLog);
  } else {
    logger.error(`${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`);
  }

  // MongoDB cast error
  if (err.name === 'CastError') error = handleCastErrorDB(error);

  // MongoDB duplicate key error
  if (err.code === 11000) error = handleDuplicateFieldsDB(error);

  // MongoDB validation error
  if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

  // JWT errors
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Rate limit error
  if (err.type === 'entity.too.large') {
    error = new AppError('Request entity too large', 413);
  }

  // Mongoose version error
  if (err.name === 'VersionError') {
    error = new AppError('Document was modified by another user. Please refresh and try again.', 409);
  }

  // Send error response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const message = `Can't find ${req.originalUrl} on this server`;
  const error = new AppError(message, 404);
  next(error);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default { errorHandler, notFoundHandler, asyncHandler };