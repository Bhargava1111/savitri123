import mongoose from 'mongoose';
import Redis from 'ioredis';
import { logger } from '../utils/logger.js';

// MongoDB Connection Configuration
export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private mongoConnection: typeof mongoose | null = null;
  private redisClient: Redis | null = null;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  // MongoDB Connection
  public async connectMongoDB(): Promise<typeof mongoose> {
    try {
      if (this.mongoConnection) {
        return this.mongoConnection;
      }

      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pickle_paradise';
      
      const options: mongoose.ConnectOptions = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferCommands: false, // Disable mongoose buffering
        bufferMaxEntries: 0, // Disable mongoose buffering
        retryWrites: true,
        writeConcern: {
          w: 'majority'
        }
      };

      this.mongoConnection = await mongoose.connect(mongoUri, options);

      // Connection event listeners
      mongoose.connection.on('connected', () => {
        logger.info('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed through app termination');
        process.exit(0);
      });

      return this.mongoConnection;
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  // Redis Connection
  public async connectRedis(): Promise<Redis> {
    try {
      if (this.redisClient) {
        return this.redisClient;
      }

      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      this.redisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
        family: 4 // 4 (IPv4) or 6 (IPv6)
      });

      // Redis event listeners
      this.redisClient.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      this.redisClient.on('ready', () => {
        logger.info('Redis ready to accept commands');
      });

      this.redisClient.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      this.redisClient.on('close', () => {
        logger.warn('Redis connection closed');
      });

      this.redisClient.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      // Connect to Redis
      await this.redisClient.connect();

      return this.redisClient;
    } catch (error) {
      logger.error('Redis connection failed:', error);
      throw error;
    }
  }

  // Get MongoDB connection
  public getMongoDB(): typeof mongoose | null {
    return this.mongoConnection;
  }

  // Get Redis client
  public getRedis(): Redis | null {
    return this.redisClient;
  }

  // Health check for databases
  public async healthCheck(): Promise<{
    mongodb: boolean;
    redis: boolean;
    status: 'healthy' | 'degraded' | 'unhealthy';
  }> {
    const health = {
      mongodb: false,
      redis: false,
      status: 'unhealthy' as 'healthy' | 'degraded' | 'unhealthy'
    };

    try {
      // Check MongoDB
      if (this.mongoConnection && mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      logger.error('MongoDB health check failed:', error);
    }

    try {
      // Check Redis
      if (this.redisClient) {
        const result = await this.redisClient.ping();
        health.redis = result === 'PONG';
      }
    } catch (error) {
      logger.error('Redis health check failed:', error);
    }

    // Determine overall status
    if (health.mongodb && health.redis) {
      health.status = 'healthy';
    } else if (health.mongodb || health.redis) {
      health.status = 'degraded';
    } else {
      health.status = 'unhealthy';
    }

    return health;
  }

  // Close all connections
  public async closeConnections(): Promise<void> {
    try {
      if (this.mongoConnection) {
        await mongoose.connection.close();
        this.mongoConnection = null;
        logger.info('MongoDB connection closed');
      }

      if (this.redisClient) {
        await this.redisClient.quit();
        this.redisClient = null;
        logger.info('Redis connection closed');
      }
    } catch (error) {
      logger.error('Error closing database connections:', error);
    }
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();

// MongoDB connection helper
export const connectMongoDB = () => dbConnection.connectMongoDB();

// Redis connection helper
export const connectRedis = () => dbConnection.connectRedis();

// Database health check helper
export const checkDatabaseHealth = () => dbConnection.healthCheck();