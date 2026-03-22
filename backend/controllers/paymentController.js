import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import { razorpayInstance } from '../config/razorpay.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generatePaymentReceipt } from '../utils/pdfGenerator.js';
import { sendPaymentReceiptEmail } from '../utils/emailService.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private (Student)
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { feeId } = req.body;

  const fee = await Fee.findById(feeId).populate('student');
  if (!fee) {
    throw new ApiError(404, 'Fee not found');
  }

  // Verify student ownership
  const student = await Student.findOne({ user: req.user._id });
  if (fee.student._id.toString() !== student._id.toString()) {
    throw new ApiError(403, 'Not authorized to pay this fee');
  }

  if (fee.dueAmount <= 0) {
    throw new ApiError(400, 'No due amount for this fee');
  }

  // Create Razorpay order
  const options = {
    amount: Math.round(fee.dueAmount * 100), // Amount in paise
    currency: 'INR',
    receipt: `fee_${feeId}_${Date.now()}`,
    notes: {
      feeId: feeId,
      studentId: student._id.toString(),
      month: fee.month.toISOString(),
    },
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      'Razorpay order created successfully'
    )
  );
});

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify-payment
// @access  Private (Student)
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, feeId } = req.body;

  const fee = await Fee.findById(feeId).populate('student');
  if (!fee) {
    throw new ApiError(404, 'Fee not found');
  }

  // Verify student ownership
  const student = await Student.findOne({ user: req.user._id });
  if (fee.student._id.toString() !== student._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  // Verify signature
  const sign = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest('hex');

  if (razorpaySignature !== expectedSign) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  // Create payment record
  const payment = await Payment.create({
    student: student._id,
    fee: feeId,
    amount: fee.dueAmount,
    paymentMode: 'online',
    paymentMethod: 'razorpay',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'success',
    paymentDate: new Date(),
  });

  // Update fee
  fee.amountPaid += fee.dueAmount;
  fee.payments.push(payment._id);
  await fee.save();

  // Generate PDF receipt
  const receiptPath = await generatePaymentReceipt(payment._id);
  payment.receiptUrl = receiptPath;
  await payment.save();

  // Send email with receipt
  const user = await Student.findById(student._id).populate('user');
  await sendPaymentReceiptEmail(
    user.user.email,
    student.name,
    payment.receiptNumber,
    payment.amount,
    fee.month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    'Online',
    receiptPath
  );

  // Create notification
  await Notification.create({
    recipient: user.user._id,
    title: 'Payment Successful',
    message: `Your payment of ₹${payment.amount} has been received successfully.`,
    type: 'payment',
    link: `/student/payments`,
  });

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'PAYMENT',
    entity: 'payment',
    entityId: payment._id,
    description: `Online payment of ₹${payment.amount} - Receipt: ${payment.receiptNumber}`,
  });

  // Emit socket event
  const io = req.app.get('io');
  io.emit('payment:success', { studentId: student._id, payment });

  res.status(200).json(new ApiResponse(200, payment, 'Payment verified and recorded successfully'));
});

// @desc    Record offline payment
// @route   POST /api/payments/record-offline
// @access  Private (Admin)
export const recordOfflinePayment = asyncHandler(async (req, res) => {
  const { feeId, amount, paymentMethod, remarks } = req.body;

  const fee = await Fee.findById(feeId).populate('student');
  if (!fee) {
    throw new ApiError(404, 'Fee not found');
  }

  if (amount > fee.dueAmount) {
    throw new ApiError(400, 'Payment amount exceeds due amount');
  }

  // Create payment record
  const payment = await Payment.create({
    student: fee.student._id,
    fee: feeId,
    amount,
    paymentMode: 'offline',
    paymentMethod,
    status: 'success',
    paymentDate: new Date(),
    remarks,
    recordedBy: req.user._id,
  });

  // Update fee
  fee.amountPaid += amount;
  fee.payments.push(payment._id);
  await fee.save();

  // Generate PDF receipt
  const receiptPath = await generatePaymentReceipt(payment._id);
  payment.receiptUrl = receiptPath;
  await payment.save();

  // Send email with receipt
  const student = await Student.findById(fee.student._id).populate('user');
  await sendPaymentReceiptEmail(
    student.user.email,
    student.name,
    payment.receiptNumber,
    payment.amount,
    fee.month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    paymentMethod,
    receiptPath
  );

  // Create notification
  await Notification.create({
    recipient: student.user._id,
    title: 'Payment Recorded',
    message: `Your ${paymentMethod} payment of ₹${payment.amount} has been recorded.`,
    type: 'payment',
    link: `/student/payments`,
  });

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'PAYMENT',
    entity: 'payment',
    entityId: payment._id,
    description: `Recorded offline payment of ₹${payment.amount} for ${student.name} - Receipt: ${payment.receiptNumber}`,
  });

  // Emit socket event
  const io = req.app.get('io');
  io.emit('payment:recorded', { studentId: fee.student._id, payment });

  res.status(201).json(new ApiResponse(201, payment, 'Offline payment recorded successfully'));
});

// @desc    Get payment history
// @route   GET /api/payments/student/:studentId
// @access  Private
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Check authorization
  if (req.user.role === 'student') {
    const userStudent = await Student.findOne({ user: req.user._id });
    if (userStudent._id.toString() !== studentId) {
      throw new ApiError(403, 'Not authorized to view this payment history');
    }
  }

  const payments = await Payment.find({ student: studentId })
    .populate('fee')
    .sort({ paymentDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Payment.countDocuments({ student: studentId });

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payments,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      'Payment history retrieved successfully'
    )
  );
});

// @desc    Download receipt
// @route   GET /api/payments/:id/receipt
// @access  Private
export const downloadReceipt = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id).populate('student fee');

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  // Check authorization
  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user._id });
    if (payment.student._id.toString() !== student._id.toString()) {
      throw new ApiError(403, 'Not authorized to download this receipt');
    }
  }

  // Generate receipt if not exists
  let receiptPath = payment.receiptUrl;
  if (!receiptPath) {
    receiptPath = await generatePaymentReceipt(payment._id);
    payment.receiptUrl = receiptPath;
    await payment.save();
  }

  res.status(200).json(
    new ApiResponse(200, { receiptUrl: receiptPath, receiptNumber: payment.receiptNumber }, 'Receipt URL retrieved')
  );
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private (Admin)
export const getPaymentStats = asyncHandler(async (req, res) => {
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'success',
        paymentDate: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const onlinePayments = await Payment.countDocuments({ paymentMode: 'online', status: 'success' });
  const offlinePayments = await Payment.countDocuments({ paymentMode: 'offline', status: 'success' });

  const stats = {
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    monthlyRevenue: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
    onlinePayments,
    offlinePayments,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Payment statistics retrieved successfully'));
});
