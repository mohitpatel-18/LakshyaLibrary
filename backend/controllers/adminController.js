import ActivityLog from '../models/ActivityLog.js';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import Fee from '../models/Fee.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateStudentIDCard } from '../utils/pdfGenerator.js';
import { generateCSVExport } from '../utils/csvExport.js';

// @desc    Get activity logs
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, entity = 'all' } = req.query;

  const query = {};
  if (entity !== 'all') {
    query.entity = entity;
  }

  const logs = await ActivityLog.find(query)
    .populate('user', 'email role')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await ActivityLog.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        logs,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      'Activity logs retrieved successfully'
    )
  );
});

// @desc    Generate student ID card
// @route   POST /api/admin/generate-id-card/:studentId
// @access  Private
export const generateIDCard = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const idCardPath = await generateStudentIDCard(studentId);

  res.status(200).json(
    new ApiResponse(200, { idCardUrl: idCardPath }, 'ID card generated successfully')
  );
});

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private (Admin)
export const exportData = asyncHandler(async (req, res) => {
  const { type } = req.params; // students, payments, fees
  const { startDate, endDate } = req.query;

  let data = [];
  let filename = '';
  let headers = [];

  switch (type) {
    case 'students':
      data = await Student.find()
        .populate('user', 'email')
        .populate('seat', 'seatNumber')
        .lean();
      
      filename = `students_export_${Date.now()}.csv`;
      headers = [
        'Student ID',
        'Name',
        'Email',
        'Phone',
        'Membership Type',
        'Seat Number',
        'Joining Date',
        'Status',
        'Total Due'
      ];
      
      data = data.map(student => ({
        studentId: student.studentId,
        name: student.name,
        email: student.user?.email || '',
        phone: student.phone,
        membershipType: student.membershipType,
        seatNumber: student.seat?.seatNumber || 'Not Assigned',
        joiningDate: new Date(student.joiningDate).toLocaleDateString(),
        status: student.isActive ? 'Active' : 'Inactive',
        totalDue: student.totalDue || 0
      }));
      break;

    case 'payments':
      const paymentQuery = {};
      if (startDate && endDate) {
        paymentQuery.paymentDate = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      data = await Payment.find(paymentQuery)
        .populate('student', 'studentId name')
        .populate('fee', 'month')
        .lean();
      
      filename = `payments_export_${Date.now()}.csv`;
      headers = [
        'Receipt Number',
        'Student ID',
        'Student Name',
        'Amount',
        'Payment Mode',
        'Payment Method',
        'Payment Date',
        'Month',
        'Status',
        'Transaction ID'
      ];
      
      data = data.map(payment => ({
        receiptNumber: payment.receiptNumber,
        studentId: payment.student?.studentId || '',
        studentName: payment.student?.name || '',
        amount: payment.amount,
        paymentMode: payment.paymentMode,
        paymentMethod: payment.paymentMethod || '',
        paymentDate: new Date(payment.paymentDate).toLocaleDateString(),
        month: payment.fee?.month ? new Date(payment.fee.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
        status: payment.status,
        transactionId: payment.transactionId || ''
      }));
      break;

    case 'fees':
      const feeQuery = {};
      if (startDate && endDate) {
        feeQuery.month = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      data = await Fee.find(feeQuery)
        .populate('student', 'studentId name')
        .lean();
      
      filename = `fees_export_${Date.now()}.csv`;
      headers = [
        'Student ID',
        'Student Name',
        'Month',
        'Base Amount',
        'Discount',
        'Late Fee',
        'Total Amount',
        'Amount Paid',
        'Due Amount',
        'Status',
        'Due Date'
      ];
      
      data = data.map(fee => ({
        studentId: fee.student?.studentId || '',
        studentName: fee.student?.name || '',
        month: new Date(fee.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        baseAmount: fee.baseAmount,
        discount: fee.discount,
        lateFee: fee.lateFee,
        totalAmount: fee.totalAmount,
        amountPaid: fee.amountPaid,
        dueAmount: fee.dueAmount,
        status: fee.status,
        dueDate: new Date(fee.dueDate).toLocaleDateString()
      }));
      break;

    default:
      throw new ApiError(400, 'Invalid export type. Use: students, payments, or fees');
  }

  const csvPath = await generateCSVExport(data, headers, filename);

  res.status(200).json(
    new ApiResponse(200, { csvPath, filename }, `${type} data exported successfully`)
  );
});
