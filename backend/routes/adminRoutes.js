import express from 'express';
import {
  getActivityLogs,
  generateIDCard,
  exportData,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/activity-logs', authorize('admin'), getActivityLogs);
router.post('/generate-id-card/:studentId', generateIDCard);
router.get('/export/:type', authorize('admin'), exportData);

export default router;
