class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error types for common scenarios
class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
  }
}

class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, 500);
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
  }
}

class PaymentError extends AppError {
  constructor(message = 'Payment processing failed') {
    super(message, 402);
  }
}

class InventoryError extends AppError {
  constructor(message = 'Insufficient inventory') {
    super(message, 409);
  }
}

class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable') {
    super(message, 503);
  }
}

// Error factory function
const createError = (type, message, statusCode) => {
  switch (type) {
    case 'VALIDATION':
      return new ValidationError(message);
    case 'AUTHENTICATION':
      return new AuthenticationError(message);
    case 'AUTHORIZATION':
      return new AuthorizationError(message);
    case 'NOT_FOUND':
      return new NotFoundError(message);
    case 'CONFLICT':
      return new ConflictError(message);
    case 'RATE_LIMIT':
      return new RateLimitError(message);
    case 'PAYMENT':
      return new PaymentError(message);
    case 'INVENTORY':
      return new InventoryError(message);
    case 'SERVICE_UNAVAILABLE':
      return new ServiceUnavailableError(message);
    case 'DATABASE':
      return new DatabaseError(message);
    default:
      return new AppError(message, statusCode || 500);
  }
};

// MongoDB specific error handling
const handleMongoError = (error) => {
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return new ValidationError(`Validation failed: ${errors.join(', ')}`);
  }
  
  if (error.name === 'CastError') {
    return new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return new ConflictError(`${field} already exists`);
  }
  
  if (error.name === 'MongoNetworkError') {
    return new ServiceUnavailableError('Database connection failed');
  }
  
  return new DatabaseError('Database operation failed');
};

// JWT specific error handling
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  
  return new AuthenticationError('Authentication failed');
};

// Async error handler
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  DatabaseError,
  PaymentError,
  InventoryError,
  ServiceUnavailableError,
  createError,
  handleMongoError,
  handleJWTError,
  asyncHandler
};