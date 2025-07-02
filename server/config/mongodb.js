import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pickle_paradise';

class MongoDB {
  static async connect() {
    try {
      const conn = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false,
        bufferMaxEntries: 0
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      
      // Set up connection event listeners
      mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      });

      return conn;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  static async disconnect() {
    try {
      await mongoose.connection.close();
      console.log('MongoDB disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  static getConnectionState() {
    return {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name
    };
  }
}

export default MongoDB;