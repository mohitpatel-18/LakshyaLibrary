import express from 'express';
import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  toggleStudentStatus,
  deleteStudent,
  getStudentDashboard,
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Student dashboard
router.get('/dashboard/stats', protect, authorize('student'), getStudentDashboard);

// Admin routes
router.use(protect);
router.get('/', authorize('admin'), getAllStudents);
router.post('/', authorize('admin'), createStudent);
router.get('/:id', getStudent);
router.put('/:id', authorize('admin'), updateStudent);
router.patch('/:id/toggle-status', authorize('admin'), toggleStudentStatus);
router.delete('/:id', authorize('admin'), deleteStudent);

export default router;
