import { logger } from '../utils/logger.js';

export const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join user-specific room
    socket.on('join', (userId) => {
      socket.join(userId);
      logger.debug(`User ${userId} joined their room`);
    });

    // Join admin room
    socket.on('join:admin', () => {
      socket.join('admin-room');
      logger.debug('Admin joined admin room');
    });

    // Real-time seat updates
    socket.on('seat:subscribe', () => {
      socket.join('seats');
      logger.debug('Client subscribed to seat updates');
    });

    // Real-time dashboard updates
    socket.on('dashboard:subscribe', () => {
      socket.join('dashboard');
      logger.debug('Client subscribed to dashboard updates');
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.success('Socket.io handlers initialized');
};
