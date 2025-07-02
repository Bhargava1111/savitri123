import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import session from 'express-session';
import RedisStore from 'connect-redis';

import { connectMongoDB, connectRedis, dbConnection } from './config/database.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';
import { corsOptions } from './config/cors.js';
import { socketHandler } from './socket/socketHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import categoryRoutes from './routes/category.js';
import orderRoutes from './routes/order.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';
import reviewRoutes from './routes/review.js';
import paymentRoutes from './routes/payment.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';

// Types
interface AppConfig {
  port: number;
  nodeEnv: string;
  apiVersion: string;
}

class PickleParadiseServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private config: AppConfig;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: true
      }
    });
    
    this.config = {
      port: parseInt(process.env.PORT || '8000', 10),
      nodeEnv: process.env.NODE_ENV || 'development',
      apiVersion: process.env.API_VERSION || 'v1'
    };

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeSocketIO();
  }

  private async initializeMiddleware(): Promise<void> {
    // Trust proxy for accurate client IP addresses
    this.app.set('trust proxy', 1);

    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "https://checkout.razorpay.com"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'", "https://checkout.razorpay.com"]
        },
      },
      crossOriginEmbedderPolicy: false
    }));

    // CORS
    this.app.use(cors(corsOptions));

    // Compression
    this.app.use(compression());

    // Request logging
    if (this.config.nodeEnv === 'development') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined', {
        stream: { write: (message) => logger.info(message.trim()) }
      }));
    }

    // Custom request logger
    this.app.use(requestLogger);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Data sanitization
    this.app.use(mongoSanitize());
    this.app.use(xss());
    this.app.use(hpp({
      whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'spiceLevel', 'dietary']
    }));

    // Rate limiting
    this.app.use('/api/', apiLimiter);
    this.app.use('/api/auth/login', authLimiter);
    this.app.use('/api/auth/register', authLimiter);

    // Session configuration (for admin sessions)
    try {
      const redisClient = await connectRedis();
      this.app.use(session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || 'pickle-paradise-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: this.config.nodeEnv === 'production',
          httpOnly: true,
          maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '3600000', 10) // 1 hour
        },
        name: 'pickle.sid'
      }));
    } catch (error) {
      logger.error('Failed to initialize Redis session store:', error);
      // Fallback to memory store (not recommended for production)
      this.app.use(session({
        secret: process.env.SESSION_SECRET || 'pickle-paradise-secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE || '3600000', 10)
        }
      }));
    }

    // Health check endpoint (before other routes)
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: this.config.nodeEnv,
        version: this.config.apiVersion
      });
    });

    logger.info('Middleware initialization completed');
  }

  private initializeRoutes(): void {
    const apiBase = `/api/${this.config.apiVersion}`;

    // Mount routes
    this.app.use(`${apiBase}/auth`, authRoutes);
    this.app.use(`${apiBase}/users`, userRoutes);
    this.app.use(`${apiBase}/products`, productRoutes);
    this.app.use(`${apiBase}/categories`, categoryRoutes);
    this.app.use(`${apiBase}/orders`, orderRoutes);
    this.app.use(`${apiBase}/cart`, cartRoutes);
    this.app.use(`${apiBase}/wishlist`, wishlistRoutes);
    this.app.use(`${apiBase}/reviews`, reviewRoutes);
    this.app.use(`${apiBase}/payments`, paymentRoutes);
    this.app.use(`${apiBase}/notifications`, notificationRoutes);
    this.app.use(`${apiBase}/admin`, adminRoutes);
    this.app.use(`${apiBase}/health`, healthRoutes);

    // API documentation endpoint
    this.app.get(`${apiBase}`, (req, res) => {
      res.json({
        name: 'Pickle Paradise API',
        version: this.config.apiVersion,
        description: 'Comprehensive e-commerce API for pickle products',
        endpoints: {
          auth: `${apiBase}/auth`,
          users: `${apiBase}/users`,
          products: `${apiBase}/products`,
          categories: `${apiBase}/categories`,
          orders: `${apiBase}/orders`,
          cart: `${apiBase}/cart`,
          wishlist: `${apiBase}/wishlist`,
          reviews: `${apiBase}/reviews`,
          payments: `${apiBase}/payments`,
          notifications: `${apiBase}/notifications`,
          admin: `${apiBase}/admin`,
          health: `${apiBase}/health`
        }
      });
    });

    logger.info('Routes initialization completed');
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);

    logger.info('Error handling initialization completed');
  }

  private initializeSocketIO(): void {
    // Socket.IO middleware and handlers
    socketHandler(this.io);
    logger.info('Socket.IO initialization completed');
  }

  public async start(): Promise<void> {
    try {
      // Connect to databases
      await connectMongoDB();
      await connectRedis();

      // Start server
      this.server.listen(this.config.port, () => {
        logger.info(`🚀 Pickle Paradise server started successfully!`);
        logger.info(`📡 Server running on port ${this.config.port}`);
        logger.info(`🌍 Environment: ${this.config.nodeEnv}`);
        logger.info(`📋 API Version: ${this.config.apiVersion}`);
        logger.info(`🔗 API Base URL: /api/${this.config.apiVersion}`);
        
        if (this.config.nodeEnv === 'development') {
          logger.info(`🔧 Dev API URL: http://localhost:${this.config.port}/api/${this.config.apiVersion}`);
          logger.info(`📊 Health Check: http://localhost:${this.config.port}/health`);
        }
      });

      // Graceful shutdown handlers
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      try {
        // Close server
        await new Promise<void>((resolve) => {
          this.server.close(() => {
            logger.info('HTTP server closed');
            resolve();
          });
        });

        // Close Socket.IO
        this.io.close(() => {
          logger.info('Socket.IO server closed');
        });

        // Close database connections
        await dbConnection.closeConnections();

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
  }

  public getApp(): express.Application {
    return this.app;
  }

  public getServer(): any {
    return this.server;
  }

  public getIO(): SocketIOServer {
    return this.io;
  }
}

// Create and start server
const server = new PickleParadiseServer();

// Start the server
server.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

// Export for testing
export default server;