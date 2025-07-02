import { Request, Response, NextFunction } from 'express';
import { JwtPayload, AuthUser } from './index.js';

// Extend Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
    userId?: string;
    sessionId?: string;
    correlationId?: string;
    startTime?: number;
    files?: Express.Multer.File | Express.Multer.File[];
    rateLimitInfo?: {
      limit: number;
      remaining: number;
      reset: Date;
    };
  }
}

// Custom Express types
export interface AuthenticatedRequest extends Request {
  user: AuthUser;
  userId: string;
}

export interface UploadRequest extends Request {
  files: Express.Multer.File[];
}

export interface PaginatedRequest extends Request {
  pagination: {
    page: number;
    limit: number;
    skip: number;
    sort: string;
    order: 'asc' | 'desc';
  };
}

// Controller types
export type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type AuthControllerFunction = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Middleware types
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export type ErrorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// Route handler types
export interface RouteConfig {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  path: string;
  handler: ControllerFunction;
  middleware?: MiddlewareFunction[];
  auth?: boolean;
  roles?: string[];
  rateLimiting?: {
    windowMs: number;
    max: number;
  };
  validation?: {
    body?: any;
    query?: any;
    params?: any;
  };
}

// API Response helpers
export interface ResponseConfig {
  statusCode?: number;
  message?: string;
  meta?: Record<string, any>;
}

export type ApiResponseFunction = <T = any>(
  res: Response,
  data?: T,
  config?: ResponseConfig
) => Response;

// Validation types
export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
    min?: number;
    max?: number;
    pattern?: RegExp;
    enum?: any[];
    custom?: (value: any) => boolean | string;
  };
}

// File upload types
export interface FileUploadConfig {
  destination: string;
  filename?: (req: Request, file: Express.Multer.File) => string;
  fileFilter?: (req: Request, file: Express.Multer.File) => boolean;
  limits?: {
    fileSize?: number;
    files?: number;
  };
  allowedMimeTypes?: string[];
}

// Pagination types
export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query types
export interface FilterQuery {
  [key: string]: any;
}

export interface SortQuery {
  [key: string]: 1 | -1;
}

// Cache types
export interface CacheOptions {
  ttl?: number;
  key?: string;
  prefix?: string;
  tags?: string[];
}

// Session types
export interface SessionData {
  userId?: string;
  email?: string;
  role?: string;
  permissions?: string[];
  lastActivity?: Date;
  ipAddress?: string;
  userAgent?: string;
}

declare module 'express-session' {
  interface SessionData {
    user?: SessionData;
  }
}

export default {
  AuthenticatedRequest,
  UploadRequest,
  PaginatedRequest,
  ControllerFunction,
  AuthControllerFunction,
  MiddlewareFunction,
  ErrorMiddleware,
  RouteConfig,
  ValidationRules,
  FileUploadConfig,
  PaginationOptions,
  PaginationResult
};