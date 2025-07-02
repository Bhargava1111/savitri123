import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false
});

// Create a stream object for morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Additional methods for structured logging
logger.logRequest = (req, message = 'Request received') => {
  logger.info(message, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });
};

logger.logResponse = (req, res, message = 'Response sent') => {
  logger.info(message, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: res.responseTime,
    userId: req.user?.id
  });
};

logger.logError = (error, req = null, additionalInfo = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    ...additionalInfo
  };
  
  if (req) {
    errorInfo.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id
    };
  }
  
  logger.error('Application Error', errorInfo);
};

logger.logPayment = (payment, status, additionalInfo = {}) => {
  logger.info('Payment Event', {
    paymentId: payment.id,
    orderId: payment.orderId,
    amount: payment.amount,
    method: payment.method,
    status,
    ...additionalInfo
  });
};

logger.logOrder = (order, action, additionalInfo = {}) => {
  logger.info('Order Event', {
    orderId: order._id,
    orderNumber: order.orderNumber,
    userId: order.user,
    action,
    status: order.status,
    total: order.pricing?.total,
    ...additionalInfo
  });
};

logger.logChat = (conversation, action, additionalInfo = {}) => {
  logger.info('Chat Event', {
    conversationId: conversation._id,
    sessionId: conversation.sessionId,
    userId: conversation.user,
    action,
    status: conversation.status,
    messageCount: conversation.messages?.length,
    ...additionalInfo
  });
};

logger.logInvoice = (invoice, action, additionalInfo = {}) => {
  logger.info('Invoice Event', {
    invoiceId: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    orderId: invoice.order,
    userId: invoice.user,
    action,
    status: invoice.status,
    amount: invoice.pricing?.grandTotal,
    ...additionalInfo
  });
};

logger.logSecurity = (event, details = {}) => {
  logger.warn('Security Event', {
    event,
    timestamp: new Date().toISOString(),
    ...details
  });
};

logger.logPerformance = (operation, duration, additionalInfo = {}) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    ...additionalInfo
  });
};

export { logger };