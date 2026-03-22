import express from 'express';
import {
  createFeeStructure,
  getAllFeeStructures,
  updateFeeStructure,
  getStudentFees,
  getPendingFees,
  generateMonthlyFees,
  calculateLateFees,
  getFeeStats,
} from '../controllers/feeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Fee structures
router.get('/structure', getAllFeeStructures);
router.post('/structure', authorize('admin'), createFeeStructure);
router.put('/structure/:id', authorize('admin'), updateFeeStructure);

// Fee management
router.get('/student/:studentId', getStudentFees);
router.get('/pending', authorize('admin'), getPendingFees);
router.get('/stats', authorize('admin'), getFeeStats);
router.post('/generate-monthly', authorize('admin'), generateMonthlyFees);
router.post('/calculate-late-fees', authorize('admin'), calculateLateFees);

export default router;
