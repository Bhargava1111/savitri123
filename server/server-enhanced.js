import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Import database connection and models
import MongoDB from './config/mongodb.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import Review from './models/Review.js';
import Notification from './models/Notification.js';
import Invoice from './models/Invoice.js';
import ChatConversation from './models/ChatConversation.js';

// Import services and utilities
import { logger } from './utils/logger.js';
import { AppError } from './utils/AppError.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { CacheService } from './services/CacheService.js';
import { EmailService } from './services/EmailService.js';
import { SMSService } from './services/SMSService.js';
import { WhatsAppService } from './services/WhatsAppService.js';
import { PaymentService } from './services/PaymentService.js';
import { ChatbotService } from './services/ChatbotService.js';
import { AutoInvoiceService } from './services/AutoInvoiceService.js';
import { RecommendationService } from './services/RecommendationService.js';

// Import middleware
import { authMiddleware } from './middleware/auth.js';
import { adminMiddleware } from './middleware/admin.js';
import { validationMiddleware } from './middleware/validation.js';

// Import API routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';
import categoryRoutes from './routes/category.js';
import cartRoutes from './routes/cart.js';
import reviewRoutes from './routes/review.js';
import notificationRoutes from './routes/notification.js';
import invoiceRoutes from './routes/invoice.js';
import adminRoutes from './routes/admin.js';

// Configuration
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8000;

// Initialize Redis for caching and session management
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

// Initialize services
const cacheService = new CacheService(redis);
const emailService = new EmailService();
const smsService = new SMSService();
const whatsappService = new WhatsAppService();
const paymentService = new PaymentService();
const chatbotService = new ChatbotService();
const autoInvoiceService = new AutoInvoiceService();
const recommendationService = new RecommendationService();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.razorpay.com"],
      frameSrc: ["https://api.razorpay.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

app.use(compression());
app.use(morgan('combined', { stream: logger.stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    increment: async (key) => {
      const count = await redis.incr(`ratelimit:${key}`);
      if (count === 1) {
        await redis.expire(`ratelimit:${key}`, 900); // 15 minutes
      }
      return { totalHits: count, resetTime: new Date(Date.now() + 900000) };
    },
    decrement: async (key) => {
      await redis.decr(`ratelimit:${key}`);
    },
    resetKey: async (key) => {
      await redis.del(`ratelimit:${key}`);
    }
  }
});

// Speed limiting
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 50
});

app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(hpp());

// Cache middleware
const cacheMiddleware = (ttl = 300) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    const key = `cache:${req.originalUrl}`;
    const cached = await cacheService.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    const originalJson = res.json;
    res.json = function(data) {
      cacheService.set(key, data, ttl);
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Socket.io Real-time Features
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  // Live chat support with AI chatbot
  socket.on('join-chat', async (data) => {
    try {
      const { userId, sessionId } = data;
      
      // Join user to their chat room
      socket.join(`user_${userId}`);
      socket.join(`session_${sessionId}`);
      
      // Initialize or get existing conversation
      let conversation = await ChatConversation.findOne({ sessionId });
      
      if (!conversation) {
        conversation = await ChatConversation.create({
          sessionId,
          user: userId,
          context: {
            intent: 'greeting',
            language: 'en',
            conversationFlow: 'greeting'
          },
          channel: 'website',
          deviceInfo: {
            userAgent: socket.handshake.headers['user-agent'],
            ipAddress: socket.handshake.address
          }
        });
        
        // Send welcome message
        const welcomeMessage = await chatbotService.generateWelcomeMessage(userId);
        await conversation.addMessage('bot', welcomeMessage.content, welcomeMessage.type, welcomeMessage.metadata);
        
        socket.emit('bot-message', welcomeMessage);
      }
      
      socket.emit('chat-joined', { sessionId, conversationId: conversation._id });
      
    } catch (error) {
      logger.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });
  
  socket.on('send-message', async (data) => {
    try {
      const { sessionId, message, type = 'text' } = data;
      
      // Find conversation
      const conversation = await ChatConversation.findOne({ sessionId });
      if (!conversation) {
        return socket.emit('error', { message: 'Conversation not found' });
      }
      
      // Add user message
      await conversation.addMessage('user', message, type);
      
      // Process message through NLP pipeline
      const nlpResult = await chatbotService.processMessage(message, {
        sessionId,
        userId: conversation.user,
        conversationHistory: conversation.messages
      });
      
      // Update conversation context
      await conversation.updateContext(
        nlpResult.intent.name,
        nlpResult.entities,
        nlpResult.sentiment,
        nlpResult.confidence
      );
      
      // Generate bot response or escalate to human
      if (nlpResult.confidence > 0.7) {
        const botResponse = await chatbotService.generateResponse(
          nlpResult.intent.name,
          nlpResult.entities,
          {
            sessionId,
            userId: conversation.user,
            conversation
          }
        );
        
        await conversation.addMessage('bot', botResponse.content, botResponse.type, botResponse.metadata);
        socket.emit('bot-message', botResponse);
        
        // Broadcast to user's room
        socket.to(`user_${conversation.user}`).emit('new-message', {
          sender: 'bot',
          content: botResponse.content,
          type: botResponse.type,
          timestamp: new Date()
        });
        
      } else {
        // Escalate to human agent
        await conversation.escalateToAgent('Low confidence in bot response', null);
        
        const escalationMessage = {
          content: 'I\'m connecting you with one of our customer service representatives who can better assist you.',
          type: 'text',
          metadata: { escalated: true }
        };
        
        await conversation.addMessage('bot', escalationMessage.content, escalationMessage.type, escalationMessage.metadata);
        socket.emit('bot-message', escalationMessage);
        
        // Notify admins of escalation
        io.to('admin_notifications').emit('chat-escalation', {
          conversationId: conversation._id,
          userId: conversation.user,
          reason: 'Low confidence in bot response'
        });
      }
      
    } catch (error) {
      logger.error('Error processing message:', error);
      socket.emit('error', { message: 'Failed to process message' });
    }
  });
  
  socket.on('typing', (data) => {
    socket.to(`session_${data.sessionId}`).emit('user-typing', data);
  });
  
  // Real-time order tracking
  socket.on('track-order', (orderId) => {
    socket.join(`order_${orderId}`);
  });
  
  // Live inventory updates
  socket.on('subscribe-product', (productId) => {
    socket.join(`product_${productId}`);
  });
  
  // Flash sale updates
  socket.on('flash-sale-updates', () => {
    socket.join('flash_sales');
  });
  
  // Admin notifications
  socket.on('admin-alerts', () => {
    socket.join('admin_notifications');
  });
  
  // Invoice delivery notifications
  socket.on('invoice-updates', (orderId) => {
    socket.join(`invoice_${orderId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/api/health/detailed', async (req, res) => {
  try {
    const dbStatus = MongoDB.getConnectionState();
    const redisStatus = redis.status;
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus.connected ? 'connected' : 'disconnected',
          host: dbStatus.host,
          name: dbStatus.name
        },
        redis: {
          status: redisStatus
        },
        email: {
          status: 'active'
        },
        payment: {
          status: 'active'
        }
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});

// AI-Powered Recommendation APIs
app.get('/api/ai/recommendations/:userId', authMiddleware, cacheMiddleware(600), asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 10, category, priceRange } = req.query;
  
  const recommendations = await recommendationService.getPersonalizedRecommendations(
    userId,
    { limit: parseInt(limit), category, priceRange }
  );
  
  res.json({
    success: true,
    data: recommendations
  });
}));

app.get('/api/ai/similar-products/:productId', cacheMiddleware(900), asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { limit = 5 } = req.query;
  
  const similarProducts = await recommendationService.getSimilarProducts(
    productId,
    { limit: parseInt(limit) }
  );
  
  res.json({
    success: true,
    data: similarProducts
  });
}));

app.get('/api/ai/trending-now', cacheMiddleware(300), asyncHandler(async (req, res) => {
  const { limit = 10, category } = req.query;
  
  const trendingProducts = await recommendationService.getTrendingProducts(
    { limit: parseInt(limit), category }
  );
  
  res.json({
    success: true,
    data: trendingProducts
  });
}));

// Analytics & BI APIs
app.get('/api/analytics/dashboard', authMiddleware, adminMiddleware, cacheMiddleware(300), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  const [orderStats, productStats, userStats, revenueData] = await Promise.all([
    Order.getOrderStats(start, end),
    Product.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalProducts: { $sum: 1 }, avgRating: { $avg: '$analytics.averageRating' } } }
    ]),
    User.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, newUsers: { $sum: 1 } } }
    ]),
    Order.getRevenueByDay(start, end)
  ]);
  
  res.json({
    success: true,
    data: {
      orders: orderStats[0] || {},
      products: productStats[0] || {},
      users: userStats[0] || {},
      revenue: revenueData
    }
  });
}));

// Payment webhook endpoint
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  
  try {
    const isValid = paymentService.verifyWebhookSignature(req.body, signature);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = JSON.parse(req.body.toString());
    
    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(event.payload.refund.entity);
        break;
    }
    
    res.json({ status: 'ok' });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook processing failed' });
  }
}));

// Webhook handlers
const handlePaymentCaptured = async (payment) => {
  try {
    const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
    if (!order) return;
    
    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = payment.id;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    
    await order.save();
    
    // Trigger auto-invoice generation
    await autoInvoiceService.handlePaymentCompleted({ orderId: order._id });
    
    // Send notification
    await Notification.createOrderNotification(order, 'order_confirmed');
    
    // Real-time update
    io.to(`order_${order._id}`).emit('order-updated', {
      orderId: order._id,
      status: 'confirmed',
      payment: { status: 'completed' }
    });
    
    logger.info(`Payment captured for order ${order.orderNumber}`);
  } catch (error) {
    logger.error('Error handling payment capture:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    const order = await Order.findOne({ 'payment.razorpayOrderId': payment.order_id });
    if (!order) return;
    
    order.payment.status = 'failed';
    order.payment.failureReason = payment.error_description;
    await order.save();
    
    // Send notification
    await Notification.create({
      user: order.user,
      type: 'payment_failed',
      category: 'transactional',
      title: 'Payment Failed',
      message: `Payment for order #${order.orderNumber} failed. Please try again.`,
      relatedOrder: order._id
    });
    
    logger.info(`Payment failed for order ${order.orderNumber}`);
  } catch (error) {
    logger.error('Error handling payment failure:', error);
  }
};

// Scheduled tasks
cron.schedule('0 0 * * *', async () => {
  logger.info('Running daily maintenance tasks...');
  
  try {
    // Mark abandoned chat conversations
    await ChatConversation.markAbandonedConversations();
    
    // Send invoice reminders
    const overdueInvoices = await Invoice.findOverdueInvoices();
    for (const invoice of overdueInvoices) {
      await autoInvoiceService.sendInvoiceReminder(invoice);
    }
    
    // Update product analytics
    // await updateProductAnalytics();
    
    // Clean up old cache entries
    await cacheService.cleanup();
    
    logger.info('Daily maintenance tasks completed');
  } catch (error) {
    logger.error('Error in daily maintenance:', error);
  }
});

// Inventory monitoring
cron.schedule('*/30 * * * *', async () => {
  try {
    const lowStockProducts = await Product.find({
      'variants.stock': { $lt: 10 },
      status: 'active'
    });
    
    for (const product of lowStockProducts) {
      const lowStockVariants = product.variants.filter(v => v.stock < v.lowStockThreshold);
      
      if (lowStockVariants.length > 0) {
        // Notify admins
        io.to('admin_notifications').emit('low-stock-alert', {
          productId: product._id,
          productName: product.name,
          variants: lowStockVariants
        });
      }
    }
  } catch (error) {
    logger.error('Error in inventory monitoring:', error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
  
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received, shutting down gracefully');
  
  server.close(async () => {
    try {
      await MongoDB.disconnect();
      await redis.disconnect();
      logger.info('Server shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await MongoDB.connect();
    
    // Test Redis connection
    await redis.ping();
    logger.info('Redis connected successfully');
    
    // Initialize services
    await emailService.initialize();
    await chatbotService.initialize();
    await autoInvoiceService.initialize();
    
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/api/health`);
      logger.info(`🤖 AI-powered features enabled`);
      logger.info(`📧 Auto-invoice system active`);
      logger.info(`⚡ Real-time features enabled via Socket.io`);
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();