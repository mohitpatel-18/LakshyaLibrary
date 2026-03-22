import express from 'express';
import {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getStudentGrowthAnalytics,
  getMembershipDistribution,
  getPaymentMethodDistribution,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/revenue', getRevenueAnalytics);
router.get('/student-growth', getStudentGrowthAnalytics);
router.get('/membership-distribution', getMembershipDistribution);
router.get('/payment-methods', getPaymentMethodDistribution);

export default router;
