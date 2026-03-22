import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

// Import configurations
import connectDB from './config/db.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Import socket handlers
import { initializeSocketHandlers } from './sockets/index.js';

// Import cron jobs
import './cron/feeCalculation.js';

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible to routes
app.set('io', io);

// Initialize socket handlers
initializeSocketHandlers(io);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize());
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Swagger documentation
if (process.env.NODE_ENV === 'development') {
  import('./docs/swagger.js').then((module) => {
    app.use('/api-docs', module.swaggerUi.serve, module.swaggerUi.setup(module.specs));
    logger.info('Swagger documentation available at /api-docs');
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

const isTestEnv = process.env.NODE_ENV === 'test' || Boolean(process.env.JEST_WORKER_ID);

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  return httpServer.listen(PORT, () => {
    logger.success(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

if (!isTestEnv) {
  startServer();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  httpServer.close(() => process.exit(1));
});

export { app, httpServer, io, startServer };
export default app;
