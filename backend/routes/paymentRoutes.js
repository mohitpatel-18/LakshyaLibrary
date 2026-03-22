import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  recordOfflinePayment,
  getPaymentHistory,
  downloadReceipt,
  getPaymentStats,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { paymentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protect);

// Student routes
router.post('/create-order', authorize('student'), paymentLimiter, createRazorpayOrder);
router.post('/verify-payment', authorize('student'), verifyRazorpayPayment);

// Admin routes
router.post('/record-offline', authorize('admin'), recordOfflinePayment);
router.get('/stats', authorize('admin'), getPaymentStats);

// Common routes
router.get('/student/:studentId', getPaymentHistory);
router.get('/:id/receipt', downloadReceipt);

export default router;
