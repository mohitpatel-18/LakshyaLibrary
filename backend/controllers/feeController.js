import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import FeeStructure from '../models/FeeStructure.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create fee structure
// @route   POST /api/fees/structure
// @access  Private (Admin)
export const createFeeStructure = asyncHandler(async (req, res) => {
  const { membershipType, amount, description } = req.body;

  const existingStructure = await FeeStructure.findOne({ membershipType });
  if (existingStructure) {
    throw new ApiError(400, 'Fee structure already exists for this membership type');
  }

  const feeStructure = await FeeStructure.create({
    membershipType,
    amount,
    description,
  });

  await ActivityLog.create({
    user: req.user._id,
    action: 'CREATE',
    entity: 'fee',
    description: `Created fee structure for ${membershipType}: ₹${amount}`,
  });

  res.status(201).json(new ApiResponse(201, feeStructure, 'Fee structure created successfully'));
});

// @desc    Get all fee structures
// @route   GET /api/fees/structure
// @access  Private
export const getAllFeeStructures = asyncHandler(async (req, res) => {
  const feeStructures = await FeeStructure.find({ isActive: true });
  res.status(200).json(new ApiResponse(200, feeStructures, 'Fee structures retrieved successfully'));
});

// @desc    Update fee structure
// @route   PUT /api/fees/structure/:id
// @access  Private (Admin)
export const updateFeeStructure = asyncHandler(async (req, res) => {
  const { amount, description } = req.body;

  const feeStructure = await FeeStructure.findById(req.params.id);
  if (!feeStructure) {
    throw new ApiError(404, 'Fee structure not found');
  }

  if (amount) feeStructure.amount = amount;
  if (description) feeStructure.description = description;

  await feeStructure.save();

  await ActivityLog.create({
    user: req.user._id,
    action: 'UPDATE',
    entity: 'fee',
    description: `Updated fee structure for ${feeStructure.membershipType}`,
  });

  res.status(200).json(new ApiResponse(200, feeStructure, 'Fee structure updated successfully'));
});

// @desc    Get student fees
// @route   GET /api/fees/student/:studentId
// @access  Private
export const getStudentFees = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { page = 1, limit = 10, status = 'all' } = req.query;

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Check authorization
  if (req.user.role === 'student') {
    const userStudent = await Student.findOne({ user: req.user._id });
    if (userStudent._id.toString() !== studentId) {
      throw new ApiError(403, 'Not authorized to view these fees');
    }
  }

  const query = { student: studentId };
  if (status !== 'all') {
    query.status = status;
  }

  const fees = await Fee.find(query)
    .populate('payments')
    .sort({ month: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Fee.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        fees,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      'Fees retrieved successfully'
    )
  );
});

// @desc    Get all pending fees
// @route   GET /api/fees/pending
// @access  Private (Admin)
export const getPendingFees = asyncHandler(async (req, res) => {
  const pendingFees = await Fee.find({
    status: { $in: ['pending', 'partial', 'overdue'] },
  })
    .populate('student', 'name studentId phone email')
    .sort({ dueDate: 1 });

  res.status(200).json(new ApiResponse(200, pendingFees, 'Pending fees retrieved successfully'));
});

// @desc    Generate monthly fees for all active students
// @route   POST /api/fees/generate-monthly
// @access  Private (Admin)
export const generateMonthlyFees = asyncHandler(async (req, res) => {
  const { month, year } = req.body;

  const targetMonth = new Date(year, month - 1, 1);
  targetMonth.setHours(0, 0, 0, 0);

  // Check if fees already generated for this month
  const existingFees = await Fee.countDocuments({ month: targetMonth });
  if (existingFees > 0) {
    throw new ApiError(400, 'Fees already generated for this month');
  }

  const activeStudents = await Student.find({ isActive: true });
  const feeStructures = await FeeStructure.find({ isActive: true });

  const feesToCreate = [];
  const dueDate = new Date(targetMonth);
  dueDate.setDate(5); // Due on 5th of each month

  for (const student of activeStudents) {
    const structure = feeStructures.find((s) => s.membershipType === student.membershipType);
    if (!structure) continue;

    let discountAmount = 0;
    if (student.discount.type === 'percentage') {
      discountAmount = (structure.amount * student.discount.value) / 100;
    } else {
      discountAmount = student.discount.value;
    }

    feesToCreate.push({
      student: student._id,
      month: targetMonth,
      baseAmount: structure.amount,
      discount: discountAmount,
      lateFee: 0,
      totalAmount: structure.amount - discountAmount,
      dueDate,
      status: 'pending',
    });
  }

  await Fee.insertMany(feesToCreate);

  await ActivityLog.create({
    user: req.user._id,
    action: 'GENERATE',
    entity: 'fee',
    description: `Generated fees for ${feesToCreate.length} students for ${targetMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
  });

  res.status(201).json(
    new ApiResponse(201, { generated: feesToCreate.length }, 'Monthly fees generated successfully')
  );
});

// @desc    Calculate and apply late fees
// @route   POST /api/fees/calculate-late-fees
// @access  Private (Admin) - Usually called by cron
export const calculateLateFees = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find all overdue fees
  const overdueFees = await Fee.find({
    status: { $in: ['pending', 'partial'] },
    dueDate: { $lt: today },
  }).populate('student');

  let updatedCount = 0;

  for (const fee of overdueFees) {
    const daysLate = Math.floor((today - fee.dueDate) / (1000 * 60 * 60 * 24));
    const lateFee = daysLate * fee.student.lateFeePerDay;

    if (lateFee !== fee.lateFee) {
      fee.lateFee = lateFee;
      fee.status = 'overdue';
      await fee.save();
      updatedCount++;
    }
  }

  res.status(200).json(
    new ApiResponse(200, { updated: updatedCount }, 'Late fees calculated successfully')
  );
});

// @desc    Get fee statistics
// @route   GET /api/fees/stats
// @access  Private (Admin)
export const getFeeStats = asyncHandler(async (req, res) => {
  const totalDues = await Fee.aggregate([
    { $match: { status: { $ne: 'paid' } } },
    { $group: { _id: null, total: { $sum: '$dueAmount' } } },
  ]);

  const monthlyRevenue = await Fee.aggregate([
    {
      $match: {
        status: 'paid',
        updatedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    },
    { $group: { _id: null, total: { $sum: '$amountPaid' } } },
  ]);

  const pendingCount = await Fee.countDocuments({ status: { $in: ['pending', 'partial', 'overdue'] } });
  const paidCount = await Fee.countDocuments({ status: 'paid' });

  const stats = {
    totalDues: totalDues.length > 0 ? totalDues[0].total : 0,
    monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
    pendingCount,
    paidCount,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Fee statistics retrieved successfully'));
});
