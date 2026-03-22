import Student from '../models/Student.js';
import Fee from '../models/Fee.js';
import Payment from '../models/Payment.js';
import Seat from '../models/Seat.js';
import AdmissionForm from '../models/AdmissionForm.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin)
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Student statistics
  const totalStudents = await Student.countDocuments();
  const activeStudents = await Student.countDocuments({ isActive: true });
  const inactiveStudents = await Student.countDocuments({ isActive: false });

  // Seat statistics
  const totalSeats = await Seat.countDocuments();
  const occupiedSeats = await Seat.countDocuments({ status: 'occupied' });
  const availableSeats = await Seat.countDocuments({ status: 'available' });
  const occupancyRate = totalSeats > 0 ? ((occupiedSeats / totalSeats) * 100).toFixed(2) : 0;

  // Financial statistics
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'success',
        paymentDate: { $gte: currentMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const totalDues = await Fee.aggregate([
    { $match: { status: { $ne: 'paid' } } },
    { $group: { _id: null, total: { $sum: '$dueAmount' } } },
  ]);

  const pendingFees = await Fee.countDocuments({ status: { $in: ['pending', 'partial', 'overdue'] } });

  // Admission statistics
  const pendingAdmissions = await AdmissionForm.countDocuments({ status: 'pending' });

  // Recent activities
  const recentPayments = await Payment.find({ status: 'success' })
    .populate('student', 'name studentId')
    .sort({ paymentDate: -1 })
    .limit(5);

  const recentAdmissions = await AdmissionForm.find()
    .sort({ createdAt: -1 })
    .limit(5);

  const analytics = {
    students: {
      total: totalStudents,
      active: activeStudents,
      inactive: inactiveStudents,
    },
    seats: {
      total: totalSeats,
      occupied: occupiedSeats,
      available: availableSeats,
      occupancyRate: parseFloat(occupancyRate),
    },
    finance: {
      monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
      totalDues: totalDues.length > 0 ? totalDues[0].total : 0,
      pendingFees,
    },
    admissions: {
      pending: pendingAdmissions,
    },
    recentActivities: {
      payments: recentPayments,
      admissions: recentAdmissions,
    },
  };

  res.status(200).json(new ApiResponse(200, analytics, 'Dashboard analytics retrieved successfully'));
});

// @desc    Get revenue analytics
// @route   GET /api/analytics/revenue
// @access  Private (Admin)
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const { period = 'monthly' } = req.query; // daily, weekly, monthly, yearly

  let groupBy;
  let startDate = new Date();

  if (period === 'daily') {
    groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$paymentDate' } };
    startDate.setDate(startDate.getDate() - 30); // Last 30 days
  } else if (period === 'weekly') {
    groupBy = { $week: '$paymentDate' };
    startDate.setDate(startDate.getDate() - 84); // Last 12 weeks
  } else if (period === 'monthly') {
    groupBy = { $dateToString: { format: '%Y-%m', date: '$paymentDate' } };
    startDate.setMonth(startDate.getMonth() - 12); // Last 12 months
  } else {
    groupBy = { $year: '$paymentDate' };
    startDate.setFullYear(startDate.getFullYear() - 5); // Last 5 years
  }

  const revenueData = await Payment.aggregate([
    {
      $match: {
        status: 'success',
        paymentDate: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: groupBy,
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, revenueData, 'Revenue analytics retrieved successfully'));
});

// @desc    Get student growth analytics
// @route   GET /api/analytics/student-growth
// @access  Private (Admin)
export const getStudentGrowthAnalytics = asyncHandler(async (req, res) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 12); // Last 12 months

  const growthData = await Student.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json(new ApiResponse(200, growthData, 'Student growth analytics retrieved successfully'));
});

// @desc    Get membership distribution
// @route   GET /api/analytics/membership-distribution
// @access  Private (Admin)
export const getMembershipDistribution = asyncHandler(async (req, res) => {
  const distribution = await Student.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$membershipType',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, distribution, 'Membership distribution retrieved successfully'));
});

// @desc    Get payment method distribution
// @route   GET /api/analytics/payment-methods
// @access  Private (Admin)
export const getPaymentMethodDistribution = asyncHandler(async (req, res) => {
  const distribution = await Payment.aggregate([
    { $match: { status: 'success' } },
    {
      $group: {
        _id: '$paymentMode',
        count: { $sum: 1 },
        total: { $sum: '$amount' },
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, distribution, 'Payment method distribution retrieved successfully'));
});
