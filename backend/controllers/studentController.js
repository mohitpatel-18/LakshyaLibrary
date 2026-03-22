import User from '../models/User.js';
import Student from '../models/Student.js';
import Seat from '../models/Seat.js';
import Fee from '../models/Fee.js';
import FeeStructure from '../models/FeeStructure.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSecurePassword } from '../utils/passwordGenerator.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import { logger } from '../utils/logger.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin)
export const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', status = 'all' } = req.query;

  const query = {};
  
  if (status !== 'all') {
    query.isActive = status === 'active';
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const students = await Student.find(query)
    .populate('user', 'email isActive')
    .populate('seat')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Student.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        students,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      'Students retrieved successfully'
    )
  );
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'email isActive lastLogin')
    .populate('seat');

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Students can only view their own profile, admins can view any
  if (req.user.role === 'student') {
    const userStudent = await Student.findOne({ user: req.user._id });
    if (userStudent._id.toString() !== student._id.toString()) {
      throw new ApiError(403, 'Not authorized to view this student');
    }
  }

  res.status(200).json(new ApiResponse(200, student, 'Student retrieved successfully'));
});

// @desc    Create student
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, address, membershipType, seatPreference, discount, lateFeePerDay } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  // Generate secure password
  const password = generateSecurePassword();

  // Create user account
  const user = await User.create({
    email: email.toLowerCase(),
    password,
    role: 'student',
    isActive: true,
    isOtpVerified: false,
  });

  // Create student profile
  const student = await Student.create({
    user: user._id,
    name,
    phone,
    address,
    membershipType,
    discount: discount || { type: 'percentage', value: 0 },
    lateFeePerDay: lateFeePerDay || process.env.LATE_FEE_PER_DAY || 10,
  });

  // Assign seat if preference provided and available
  if (seatPreference) {
    const seat = await Seat.findOne({ seatNumber: seatPreference, status: 'available' });
    if (seat) {
      seat.status = 'occupied';
      seat.student = student._id;
      seat.assignedDate = new Date();
      await seat.save();

      student.seat = seat._id;
      await student.save();
    }
  }

  // Generate first month's fee
  const feeStructure = await FeeStructure.findOne({ membershipType });
  if (feeStructure) {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const dueDate = new Date(currentMonth);
    dueDate.setDate(5); // Due on 5th of each month

    let discountAmount = 0;
    if (student.discount.type === 'percentage') {
      discountAmount = (feeStructure.amount * student.discount.value) / 100;
    } else {
      discountAmount = student.discount.value;
    }

    await Fee.create({
      student: student._id,
      month: currentMonth,
      baseAmount: feeStructure.amount,
      discount: discountAmount,
      lateFee: 0,
      totalAmount: feeStructure.amount - discountAmount,
      dueDate,
      status: 'pending',
    });
  }

  // Send welcome email with credentials
  await sendWelcomeEmail(user.email, student.name, student.studentId, user.email, password);

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE',
    entity: 'student',
    entityId: student._id,
    description: `Created student: ${student.name} (${student.studentId})`,
  });

  const populatedStudent = await Student.findById(student._id).populate('user seat');

  res.status(201).json(
    new ApiResponse(201, populatedStudent, 'Student created successfully. Credentials sent via email.')
  );
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
export const updateStudent = asyncHandler(async (req, res) => {
  const { name, phone, address, membershipType, discount, lateFeePerDay } = req.body;

  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Update fields
  if (name) student.name = name;
  if (phone) student.phone = phone;
  if (address) student.address = address;
  if (membershipType) student.membershipType = membershipType;
  if (discount) student.discount = discount;
  if (lateFeePerDay !== undefined) student.lateFeePerDay = lateFeePerDay;

  await student.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'UPDATE',
    entity: 'student',
    entityId: student._id,
    description: `Updated student: ${student.name} (${student.studentId})`,
  });

  const updatedStudent = await Student.findById(student._id).populate('user seat');

  res.status(200).json(new ApiResponse(200, updatedStudent, 'Student updated successfully'));
});

// @desc    Deactivate/Activate student
// @route   PATCH /api/students/:id/toggle-status
// @access  Private (Admin)
export const toggleStudentStatus = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  student.isActive = !student.isActive;
  await student.save();

  // Update user account status
  const user = await User.findById(student.user);
  user.isActive = student.isActive;
  await user.save();

  // If deactivating, release seat
  if (!student.isActive && student.seat) {
    const seat = await Seat.findById(student.seat);
    if (seat) {
      seat.status = 'available';
      seat.student = null;
      seat.assignedDate = null;
      await seat.save();
    }
    student.seat = null;
    await student.save();
  }

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: student.isActive ? 'ACTIVATE' : 'DEACTIVATE',
    entity: 'student',
    entityId: student._id,
    description: `${student.isActive ? 'Activated' : 'Deactivated'} student: ${student.name} (${student.studentId})`,
  });

  const updatedStudent = await Student.findById(student._id).populate('user seat');

  res.status(200).json(
    new ApiResponse(200, updatedStudent, `Student ${student.isActive ? 'activated' : 'deactivated'} successfully`)
  );
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Release seat if assigned
  if (student.seat) {
    const seat = await Seat.findById(student.seat);
    if (seat) {
      seat.status = 'available';
      seat.student = null;
      seat.assignedDate = null;
      await seat.save();
    }
  }

  // Delete user account
  await User.findByIdAndDelete(student.user);

  // Delete student
  await Student.findByIdAndDelete(student._id);

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'DELETE',
    entity: 'student',
    entityId: student._id,
    description: `Deleted student: ${student.name} (${student.studentId})`,
  });

  res.status(200).json(new ApiResponse(200, null, 'Student deleted successfully'));
});

// @desc    Get student dashboard stats
// @route   GET /api/students/dashboard/stats
// @access  Private (Student)
export const getStudentDashboard = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ user: req.user._id }).populate('seat');

  if (!student) {
    throw new ApiError(404, 'Student profile not found');
  }

  // Get current month fee
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const currentFee = await Fee.findOne({
    student: student._id,
    month: currentMonth,
  });

  // Get total dues
  const totalDues = await Fee.aggregate([
    { $match: { student: student._id, status: { $ne: 'paid' } } },
    { $group: { _id: null, total: { $sum: '$dueAmount' } } },
  ]);

  // Get recent payments (last 5)
  const recentPayments = await Fee.find({ student: student._id })
    .populate('payments')
    .sort({ month: -1 })
    .limit(5);

  const stats = {
    student,
    currentMonthFee: currentFee,
    totalDue: totalDues.length > 0 ? totalDues[0].total : 0,
    recentPayments,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Dashboard stats retrieved successfully'));
});
