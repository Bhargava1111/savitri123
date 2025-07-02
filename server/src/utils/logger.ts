import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = 'logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.simple(),
  winston.format.printf(info => {
    return `${info.timestamp} [${info.level}]: ${info.message}`;
  })
);

// Create Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'pickle-paradise',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Console output
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development' ? consoleFormat : logFormat
    })
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log')
    })
  ],
  
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log')
    })
  ]
});

// Log levels: error, warn, info, http, verbose, debug, silly

// Helper functions for different log levels
export const logError = (message: string, error?: any) => {
  logger.error(message, { error: error?.stack || error });
};

export const logWarn = (message: string, meta?: any) => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: any) => {
  logger.info(message, meta);
};

export const logHttp = (message: string, meta?: any) => {
  logger.http(message, meta);
};

export const logDebug = (message: string, meta?: any) => {
  logger.debug(message, meta);
};

// Request logging middleware helper
export const createRequestLogger = () => {
  return winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  );
};

// Security logging (for audit trails)
export const logSecurity = (event: string, details: any, userId?: string) => {
  logger.warn(`SECURITY: ${event}`, {
    event,
    details,
    userId,
    timestamp: new Date().toISOString(),
    type: 'security'
  });
};

// Performance logging
export const logPerformance = (operation: string, duration: number, meta?: any) => {
  logger.info(`PERFORMANCE: ${operation} took ${duration}ms`, {
    operation,
    duration,
    ...meta,
    type: 'performance'
  });
};

// Database operation logging
export const logDatabase = (operation: string, collection: string, meta?: any) => {
  logger.debug(`DB: ${operation} on ${collection}`, {
    operation,
    collection,
    ...meta,
    type: 'database'
  });
};

// API logging
export const logAPI = (method: string, url: string, statusCode: number, duration: number, userId?: string) => {
  logger.http(`API: ${method} ${url} - ${statusCode} (${duration}ms)`, {
    method,
    url,
    statusCode,
    duration,
    userId,
    type: 'api'
  });
};

export default logger;