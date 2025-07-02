import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger, logAPI, logSecurity } from '../utils/logger.js';

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const correlationId = uuidv4();
  
  // Add correlation ID to request
  req.correlationId = correlationId;
  req.startTime = startTime;
  
  // Add correlation ID to response headers
  res.setHeader('X-Correlation-ID', correlationId);
  
  // Log request start
  const requestInfo = {
    correlationId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.userId || 'anonymous',
    timestamp: new Date().toISOString()
  };
  
  // Log sensitive operations
  if (isSensitiveOperation(req)) {
    logSecurity('Sensitive operation accessed', requestInfo, req.user?.userId);
  }
  
  // Override res.end to capture response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log API call
    logAPI(req.method, req.originalUrl, statusCode, duration, req.user?.userId);
    
    // Log detailed request in development
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Request completed', {
        ...requestInfo,
        statusCode,
        duration,
        contentLength: res.get('Content-Length'),
        responseTime: `${duration}ms`
      });
    }
    
    // Log errors and slow requests
    if (statusCode >= 400) {
      logger.warn('Request failed', {
        ...requestInfo,
        statusCode,
        duration,
        error: statusCode >= 500 ? 'Server Error' : 'Client Error'
      });
    }
    
    if (duration > 5000) { // Slow request threshold: 5 seconds
      logger.warn('Slow request detected', {
        ...requestInfo,
        statusCode,
        duration,
        threshold: '5000ms'
      });
    }
    
    // Call original end function
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Check if operation is sensitive
const isSensitiveOperation = (req: Request): boolean => {
  const sensitivePatterns = [
    /\/api\/.*\/auth\//,
    /\/api\/.*\/admin\//,
    /\/api\/.*\/users\/.*\/profile/,
    /\/api\/.*\/payments\//,
    /\/api\/.*\/orders\/.*\/payment/,
    /password/i,
    /payment/i,
    /token/i
  ];
  
  return sensitivePatterns.some(pattern => pattern.test(req.originalUrl));
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = process.hrtime.bigint();
  
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - startTime) / 1000000; // Convert to milliseconds
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${duration.toFixed(2)}ms`);
    
    // Log performance metrics
    if (process.env.NODE_ENV !== 'test') {
      logger.debug('Performance metrics', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      });
    }
  });
  
  next();
};

// Request size monitor
export const requestSizeMonitor = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.get('Content-Length');
  
  if (contentLength) {
    const sizeInMB = parseInt(contentLength, 10) / (1024 * 1024);
    
    // Log large requests
    if (sizeInMB > 1) { // Threshold: 1MB
      logger.warn('Large request detected', {
        method: req.method,
        url: req.originalUrl,
        size: `${sizeInMB.toFixed(2)}MB`,
        userId: req.user?.userId || 'anonymous',
        ip: req.ip
      });
    }
    
    // Add size header
    res.setHeader('X-Request-Size', `${sizeInMB.toFixed(2)}MB`);
  }
  
  next();
};

// User activity logger
export const userActivityLogger = (req: Request, res: Response, next: NextFunction): void => {
  if (req.user) {
    const activity = {
      userId: req.user.userId,
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log significant user activities
    if (isSignificantActivity(req)) {
      logger.info('User activity', activity);
    }
  }
  
  next();
};

// Check if activity is significant for logging
const isSignificantActivity = (req: Request): boolean => {
  const significantPatterns = [
    /\/api\/.*\/orders/,
    /\/api\/.*\/payments/,
    /\/api\/.*\/profile/,
    /\/api\/.*\/cart\/checkout/,
    /\/api\/.*\/reviews/,
    /\/api\/.*\/admin/
  ];
  
  return significantPatterns.some(pattern => pattern.test(req.originalUrl));
};

// Security event logger
export const securityLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,                    // Directory traversal
    /[<>'"]/,                  // XSS attempts
    /union.*select/i,          // SQL injection
    /javascript:/i,            // XSS
    /data:text\/html/i,        // Data URI XSS
    /vbscript:/i,             // VBScript injection
    /onload=/i,               // Event handler injection
    /onerror=/i               // Event handler injection
  ];
  
  const requestContent = JSON.stringify({
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    params: req.params
  });
  
  if (suspiciousPatterns.some(pattern => pattern.test(requestContent))) {
    logSecurity('Suspicious request pattern detected', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      suspiciousContent: requestContent
    }, req.user?.userId);
  }
  
  next();
};

export default {
  requestLogger,
  performanceMonitor,
  requestSizeMonitor,
  userActivityLogger,
  securityLogger
};