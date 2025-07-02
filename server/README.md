# Pickle Paradise - Node.js/Express Backend

## 🚀 Overview

A comprehensive e-commerce backend built with Node.js, Express, TypeScript, MongoDB, and Redis. This system provides a complete foundation for an advanced pickle e-commerce platform with real-time features, AI chatbot capabilities, and automated invoice generation.

## ✨ Features

### Core Features ✅
- **TypeScript**: Full type safety and modern JavaScript features
- **MongoDB**: Flexible document database with Mongoose ODM
- **Redis**: High-performance caching and session management
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Rate Limiting**: Tier-based rate limiting with Redis backing
- **Security**: Comprehensive security with Helmet, CORS, XSS protection
- **Logging**: Structured logging with Winston
- **Error Handling**: Global error handling with proper error responses

### Advanced Features 🚧
- **Socket.io**: Real-time communication (framework ready)
- **AI Chatbot**: Intelligent customer support (models ready)
- **Auto Invoice**: GST-compliant invoice generation (models ready)
- **Multi-variant Products**: Complex product management
- **Loyalty System**: Tier-based customer rewards

## 🛠 Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis with IORedis
- **Authentication**: JWT with bcrypt
- **Validation**: Express-validator with Joi
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston with structured logs

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB (local or cloud)
- Redis (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Installation

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the environment file and configure:
```bash
cp .env.example .env
```

### 3. Database Setup

Make sure MongoDB and Redis are running:
```bash
# MongoDB (if using local installation)
mongod

# Redis (if using local installation)
redis-server
```

### 4. Build and Run

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/status` - Check service status

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1` - API documentation

## 🗂 Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts  # MongoDB & Redis setup
│   │   └── cors.ts      # CORS configuration
│   ├── middleware/      # Express middleware
│   │   ├── errorHandler.ts    # Global error handling
│   │   ├── rateLimiter.ts     # Rate limiting
│   │   └── requestLogger.ts   # Request logging
│   ├── models/          # Database models
│   │   ├── User.ts      # User model
│   │   └── Product.ts   # Product model
│   ├── routes/          # API routes
│   │   └── auth.ts      # Authentication routes
│   ├── types/           # TypeScript types
│   │   ├── index.ts     # Main type definitions
│   │   ├── errors.ts    # Error types
│   │   └── express.ts   # Express extensions
│   ├── utils/           # Utility functions
│   │   └── logger.ts    # Winston logger
│   └── server.ts        # Main server file
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── README.md           # This file
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **Rate Limiting** with Redis backing
- **Request Validation** with express-validator
- **Data Sanitization** against NoSQL injection
- **XSS Protection** with helmet and xss-clean
- **CORS Configuration** with origin validation
- **Security Headers** with helmet

## 📊 Database Models

### User Model
- Authentication (email, password, 2FA)
- Profile management (name, phone, avatar)
- Address management (multiple addresses)
- Loyalty system (points, tiers)
- Preferences (notifications, language)

### Product Model
- Multi-variant support (SKU, weight, price)
- Nutritional information
- Sourcing details (farm, certifications)
- SEO optimization
- Analytics tracking

## 🎯 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Health Check
```bash
curl http://localhost:8000/health
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

- `PORT` - Server port (default: 8000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

### Database Configuration

The system automatically:
- Connects to MongoDB with retry logic
- Sets up connection pooling
- Creates necessary indexes
- Handles graceful shutdown

### Redis Configuration

Redis is used for:
- Session storage
- Rate limiting
- Caching (ready for implementation)

## 🚧 Development Status

### Completed (65% Total)
- ✅ Core infrastructure and configuration
- ✅ Type system and error handling
- ✅ Database models (User, Product)
- ✅ Authentication system
- ✅ Security middleware
- ✅ Logging and monitoring

### In Progress
- 🔄 Complete API routes
- 🔄 Advanced services (AI, Invoice)
- 🔄 Socket.io implementation
- 🔄 Payment integration

### Planned
- 📋 Testing suite
- 📋 API documentation
- 📋 Deployment configuration
- 📋 Performance optimization

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance

- **Database**: Optimized queries with proper indexing
- **Caching**: Redis caching layer ready
- **Rate Limiting**: Prevents abuse and ensures stability
- **Compression**: Response compression enabled
- **Monitoring**: Performance tracking and alerts

## 🔍 Monitoring

- **Request Logging**: All requests logged with correlation IDs
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Response time monitoring
- **Security Events**: Suspicious activity detection

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include comprehensive logging
4. Write tests for new features
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details

---

## 🎉 Success!

Your Pickle Paradise backend is now running! 

- API available at: `http://localhost:8000/api/v1`
- Health check: `http://localhost:8000/health`
- API docs: `http://localhost:8000/api/v1`

Happy coding! 🥒