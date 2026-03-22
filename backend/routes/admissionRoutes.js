import express from 'express';
import {
  submitAdmissionForm,
  getAllAdmissionForms,
  getAdmissionForm,
  approveAdmission,
  rejectAdmission,
  getAdmissionStats,
} from '../controllers/admissionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', submitAdmissionForm);

// Admin routes
router.use(protect, authorize('admin'));
router.get('/', getAllAdmissionForms);
router.get('/stats', getAdmissionStats);
router.get('/:id', getAdmissionForm);
router.post('/:id/approve', approveAdmission);
router.post('/:id/reject', rejectAdmission);

export default router;
