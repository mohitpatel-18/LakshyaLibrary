import Seat from '../models/Seat.js';
import Student from '../models/Student.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Initialize seats
// @route   POST /api/seats/initialize
// @access  Private (Admin)
export const initializeSeats = asyncHandler(async (req, res) => {
  const { totalSeats = 100, rows = 10, cols = 10 } = req.body;

  // Check if seats already exist
  const existingSeats = await Seat.countDocuments();
  if (existingSeats > 0) {
    throw new ApiError(400, 'Seats already initialized');
  }

  const seats = [];
  let seatNumber = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (seatNumber <= totalSeats) {
        seats.push({
          seatNumber,
          status: 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
  }

  await Seat.insertMany(seats);

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'INITIALIZE',
    entity: 'seat',
    description: `Initialized ${totalSeats} seats`,
  });

  res.status(201).json(new ApiResponse(201, { totalSeats }, 'Seats initialized successfully'));
});

// @desc    Get all seats
// @route   GET /api/seats
// @access  Private
export const getAllSeats = asyncHandler(async (req, res) => {
  const seats = await Seat.find().populate('student', 'name studentId phone').sort({ seatNumber: 1 });

  res.status(200).json(new ApiResponse(200, seats, 'Seats retrieved successfully'));
});

// @desc    Get single seat
// @route   GET /api/seats/:id
// @access  Private
export const getSeat = asyncHandler(async (req, res) => {
  const seat = await Seat.findById(req.params.id).populate('student', 'name studentId phone email membershipType');

  if (!seat) {
    throw new ApiError(404, 'Seat not found');
  }

  res.status(200).json(new ApiResponse(200, seat, 'Seat retrieved successfully'));
});

// @desc    Assign seat to student
// @route   POST /api/seats/assign
// @access  Private (Admin)
export const assignSeat = asyncHandler(async (req, res) => {
  const { seatId, studentId } = req.body;

  const seat = await Seat.findById(seatId);
  if (!seat) {
    throw new ApiError(404, 'Seat not found');
  }

  if (seat.status === 'occupied') {
    throw new ApiError(400, 'Seat is already occupied');
  }

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  if (student.seat) {
    throw new ApiError(400, 'Student already has a seat assigned');
  }

  // Assign seat
  seat.status = 'occupied';
  seat.student = studentId;
  seat.assignedDate = new Date();
  await seat.save();

  // Update student
  student.seat = seatId;
  await student.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'ASSIGN',
    entity: 'seat',
    entityId: seat._id,
    description: `Assigned seat ${seat.seatNumber} to ${student.name} (${student.studentId})`,
  });

  // Emit socket event
  const io = req.app.get('io');
  io.emit('seat:updated', { seat: await Seat.findById(seat._id).populate('student') });

  const updatedSeat = await Seat.findById(seat._id).populate('student');
  res.status(200).json(new ApiResponse(200, updatedSeat, 'Seat assigned successfully'));
});

// @desc    Unassign seat
// @route   POST /api/seats/unassign
// @access  Private (Admin)
export const unassignSeat = asyncHandler(async (req, res) => {
  const { seatId } = req.body;

  const seat = await Seat.findById(seatId);
  if (!seat) {
    throw new ApiError(404, 'Seat not found');
  }

  if (seat.status === 'available') {
    throw new ApiError(400, 'Seat is not occupied');
  }

  const student = await Student.findById(seat.student);
  
  // Unassign seat
  const studentName = student ? `${student.name} (${student.studentId})` : 'Unknown';
  
  seat.status = 'available';
  const previousStudent = seat.student;
  seat.student = null;
  seat.assignedDate = null;
  await seat.save();

  // Update student
  if (student) {
    student.seat = null;
    await student.save();
  }

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'UNASSIGN',
    entity: 'seat',
    entityId: seat._id,
    description: `Unassigned seat ${seat.seatNumber} from ${studentName}`,
  });

  // Emit socket event
  const io = req.app.get('io');
  io.emit('seat:updated', { seat: await Seat.findById(seat._id) });

  res.status(200).json(new ApiResponse(200, seat, 'Seat unassigned successfully'));
});

// @desc    Get seat statistics
// @route   GET /api/seats/stats
// @access  Private (Admin)
export const getSeatStats = asyncHandler(async (req, res) => {
  const totalSeats = await Seat.countDocuments();
  const occupiedSeats = await Seat.countDocuments({ status: 'occupied' });
  const availableSeats = await Seat.countDocuments({ status: 'available' });
  const reservedSeats = await Seat.countDocuments({ status: 'reserved' });

  const stats = {
    total: totalSeats,
    occupied: occupiedSeats,
    available: availableSeats,
    reserved: reservedSeats,
    occupancyRate: totalSeats > 0 ? ((occupiedSeats / totalSeats) * 100).toFixed(2) : 0,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Seat statistics retrieved successfully'));
});
