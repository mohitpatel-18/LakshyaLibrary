import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

// Create reusable transporter
export const createEmailTransporter = () => {
  // Check if email configuration is provided
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    logger.warn('Email configuration not found. Email functionality will be disabled.');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Verify transporter configuration (non-blocking)
  transporter.verify((error, success) => {
    if (error) {
      logger.warn(`Email transporter verification failed: ${error.message}`);
      logger.warn('Email functionality may not work. Please configure SMTP settings in .env file.');
    } else {
      logger.success('Email transporter is ready');
    }
  });

  return transporter;
};

export const transporter = createEmailTransporter();
