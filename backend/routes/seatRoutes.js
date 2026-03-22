import express from 'express';
import {
  initializeSeats,
  getAllSeats,
  getSeat,
  assignSeat,
  unassignSeat,
  getSeatStats,
} from '../controllers/seatController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllSeats);
router.get('/stats', authorize('admin'), getSeatStats);
router.get('/:id', getSeat);
router.post('/initialize', authorize('admin'), initializeSeats);
router.post('/assign', authorize('admin'), assignSeat);
router.post('/unassign', authorize('admin'), unassignSeat);

export default router;
