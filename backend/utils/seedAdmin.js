import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { logger } from './logger.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected for seeding');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

    if (adminExists) {
      logger.warn('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
      isActive: true,
      isOtpVerified: true,
    });

    logger.success(`Admin user created successfully: ${admin.email}`);
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
