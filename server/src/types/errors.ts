// Custom Error Classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    errorCode?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;
  public readonly validationErrors?: ValidationErrorDetail[];

  constructor(
    message: string = 'Validation failed',
    field?: string,
    validationErrors?: ValidationErrorDetail[]
  ) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.field = field;
    this.validationErrors = validationErrors;
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, true, 'AUTH_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  public readonly resource?: string;

  constructor(message: string = 'Resource not found', resource?: string) {
    super(message, 404, true, 'NOT_FOUND');
    this.resource = resource;
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, true, 'CONFLICT');
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT');
  }
}

export class ExternalServiceError extends AppError {
  public readonly service?: string;

  constructor(message: string = 'External service error', service?: string) {
    super(message, 502, true, 'EXTERNAL_SERVICE_ERROR');
    this.service = service;
  }
}

export class DatabaseError extends AppError {
  public readonly operation?: string;

  constructor(message: string = 'Database error', operation?: string) {
    super(message, 500, true, 'DATABASE_ERROR');
    this.operation = operation;
  }
}

export class PaymentError extends AppError {
  public readonly paymentMethod?: string;
  public readonly transactionId?: string;

  constructor(
    message: string = 'Payment failed',
    paymentMethod?: string,
    transactionId?: string
  ) {
    super(message, 402, true, 'PAYMENT_ERROR');
    this.paymentMethod = paymentMethod;
    this.transactionId = transactionId;
  }
}

export class BusinessLogicError extends AppError {
  constructor(message: string) {
    super(message, 422, true, 'BUSINESS_LOGIC_ERROR');
  }
}

// Error Detail Interfaces
export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
  code?: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    path?: string;
    stack?: string;
  };
}

export interface ErrorLogData {
  error: Error;
  request?: {
    method: string;
    url: string;
    headers: Record<string, any>;
    body?: any;
    query?: any;
    params?: any;
    userId?: string;
  };
  response?: {
    statusCode: number;
    body?: any;
  };
  metadata?: Record<string, any>;
}

// Error Handler Types
export type ErrorHandler = (error: Error, req?: any, res?: any, next?: any) => void;

export interface ErrorConfig {
  showStackTrace: boolean;
  logErrors: boolean;
  notifyOnError: boolean;
  errorReporting: {
    service?: 'sentry' | 'bugsnag' | 'rollbar';
    dsn?: string;
    environment: string;
  };
}

// Common Error Messages
export const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  PHONE_NOT_VERIFIED: 'Phone number not verified',
  TWO_FACTOR_REQUIRED: 'Two-factor authentication required',
  ACCOUNT_LOCKED: 'Account temporarily locked',
  
  // Authorization
  ACCESS_DENIED: 'Access denied',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
  ADMIN_ONLY: 'Admin access required',
  
  // Validation
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_PHONE: 'Invalid phone number',
  WEAK_PASSWORD: 'Password is too weak',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_DATE: 'Invalid date format',
  INVALID_ENUM: 'Invalid value for field',
  
  // Resources
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',
  ORDER_NOT_FOUND: 'Order not found',
  CATEGORY_NOT_FOUND: 'Category not found',
  REVIEW_NOT_FOUND: 'Review not found',
  
  // Business Logic
  PRODUCT_OUT_OF_STOCK: 'Product is out of stock',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  ORDER_ALREADY_CANCELLED: 'Order already cancelled',
  ORDER_CANNOT_BE_CANCELLED: 'Order cannot be cancelled',
  REVIEW_ALREADY_EXISTS: 'Review already exists for this product',
  CART_EMPTY: 'Cart is empty',
  INVALID_COUPON: 'Invalid or expired coupon',
  
  // Payment
  PAYMENT_FAILED: 'Payment processing failed',
  PAYMENT_ALREADY_PROCESSED: 'Payment already processed',
  INVALID_PAYMENT_METHOD: 'Invalid payment method',
  PAYMENT_AMOUNT_MISMATCH: 'Payment amount mismatch',
  
  // System
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  EXTERNAL_SERVICE_ERROR: 'External service error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  FILE_UPLOAD_ERROR: 'File upload failed',
  
  // Invoice
  INVOICE_GENERATION_FAILED: 'Failed to generate invoice',
  INVOICE_NOT_FOUND: 'Invoice not found',
  INVOICE_ALREADY_SENT: 'Invoice already sent',
  
  // Chat/AI
  CHAT_SESSION_NOT_FOUND: 'Chat session not found',
  AI_SERVICE_UNAVAILABLE: 'AI service unavailable',
  MESSAGE_PROCESSING_FAILED: 'Failed to process message'
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication (1000-1099)
  AUTH_FAILED: 1001,
  TOKEN_EXPIRED: 1002,
  TOKEN_INVALID: 1003,
  ACCOUNT_LOCKED: 1004,
  EMAIL_NOT_VERIFIED: 1005,
  TWO_FACTOR_REQUIRED: 1006,
  
  // Authorization (1100-1199)
  ACCESS_DENIED: 1101,
  INSUFFICIENT_PERMISSIONS: 1102,
  ADMIN_REQUIRED: 1103,
  
  // Validation (1200-1299)
  VALIDATION_FAILED: 1201,
  REQUIRED_FIELD: 1202,
  INVALID_FORMAT: 1203,
  INVALID_LENGTH: 1204,
  INVALID_RANGE: 1205,
  
  // Business Logic (1300-1399)
  BUSINESS_RULE_VIOLATION: 1301,
  INSUFFICIENT_STOCK: 1302,
  ORDER_STATE_ERROR: 1303,
  PAYMENT_ERROR: 1304,
  DUPLICATE_RESOURCE: 1305,
  
  // System (1400-1499)
  INTERNAL_ERROR: 1401,
  DATABASE_ERROR: 1402,
  EXTERNAL_SERVICE_ERROR: 1403,
  RATE_LIMIT_ERROR: 1404,
  FILE_PROCESSING_ERROR: 1405,
  
  // Resources (1500-1599)
  RESOURCE_NOT_FOUND: 1501,
  RESOURCE_ALREADY_EXISTS: 1502,
  RESOURCE_DELETED: 1503,
  RESOURCE_LOCKED: 1504
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];