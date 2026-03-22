import AdmissionForm from '../models/AdmissionForm.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateSecurePassword } from '../utils/passwordGenerator.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Submit admission form
// @route   POST /api/admissions
// @access  Public
export const submitAdmissionForm = asyncHandler(async (req, res) => {
  const { name, email, phone, address, membershipType, seatPreference, idProof } = req.body;

  // Check if email already exists
  const existingForm = await AdmissionForm.findOne({ email: email.toLowerCase() });
  if (existingForm) {
    throw new ApiError(400, 'An admission form with this email already exists');
  }

  const admissionForm = await AdmissionForm.create({
    name,
    email: email.toLowerCase(),
    phone,
    address,
    membershipType,
    seatPreference,
    idProof,
    status: 'pending',
  });

  res.status(201).json(
    new ApiResponse(201, admissionForm, 'Admission form submitted successfully. You will be notified via email.')
  );
});

// @desc    Get all admission forms
// @route   GET /api/admissions
// @access  Private (Admin)
export const getAllAdmissionForms = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = 'all' } = req.query;

  const query = {};
  if (status !== 'all') {
    query.status = status;
  }

  const admissionForms = await AdmissionForm.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await AdmissionForm.countDocuments(query);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        admissionForms,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count,
      },
      'Admission forms retrieved successfully'
    )
  );
});

// @desc    Get single admission form
// @route   GET /api/admissions/:id
// @access  Private (Admin)
export const getAdmissionForm = asyncHandler(async (req, res) => {
  const admissionForm = await AdmissionForm.findById(req.params.id);

  if (!admissionForm) {
    throw new ApiError(404, 'Admission form not found');
  }

  res.status(200).json(new ApiResponse(200, admissionForm, 'Admission form retrieved successfully'));
});

// @desc    Approve admission and convert to student
// @route   POST /api/admissions/:id/approve
// @access  Private (Admin)
export const approveAdmission = asyncHandler(async (req, res) => {
  const admissionForm = await AdmissionForm.findById(req.params.id);

  if (!admissionForm) {
    throw new ApiError(404, 'Admission form not found');
  }

  if (admissionForm.status !== 'pending') {
    throw new ApiError(400, 'Admission form has already been processed');
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: admissionForm.email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  // Generate secure password
  const password = generateSecurePassword();

  // Create user account
  const user = await User.create({
    email: admissionForm.email,
    password,
    role: 'student',
    isActive: true,
    isOtpVerified: false,
  });

  // Create student profile
  const student = await Student.create({
    user: user._id,
    name: admissionForm.name,
    phone: admissionForm.phone,
    address: admissionForm.address,
    membershipType: admissionForm.membershipType,
    idProof: admissionForm.idProof,
  });

  // Update admission form
  admissionForm.status = 'approved';
  admissionForm.reviewedBy = req.user._id;
  admissionForm.reviewedAt = new Date();
  admissionForm.convertedToStudent = student._id;
  await admissionForm.save();

  // Send welcome email
  await sendWelcomeEmail(user.email, student.name, student.studentId, user.email, password);

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'APPROVE',
    entity: 'admission',
    entityId: admissionForm._id,
    description: `Approved admission and created student: ${student.name} (${student.studentId})`,
  });

  res.status(200).json(new ApiResponse(200, student, 'Admission approved and student created successfully'));
});

// @desc    Reject admission
// @route   POST /api/admissions/:id/reject
// @access  Private (Admin)
export const rejectAdmission = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const admissionForm = await AdmissionForm.findById(req.params.id);

  if (!admissionForm) {
    throw new ApiError(404, 'Admission form not found');
  }

  if (admissionForm.status !== 'pending') {
    throw new ApiError(400, 'Admission form has already been processed');
  }

  admissionForm.status = 'rejected';
  admissionForm.remarks = remarks;
  admissionForm.reviewedBy = req.user._id;
  admissionForm.reviewedAt = new Date();
  await admissionForm.save();

  // Log activity
  await ActivityLog.create({
    user: req.user._id,
    action: 'REJECT',
    entity: 'admission',
    entityId: admissionForm._id,
    description: `Rejected admission form from ${admissionForm.name}`,
  });

  res.status(200).json(new ApiResponse(200, admissionForm, 'Admission form rejected'));
});

// @desc    Get admission statistics
// @route   GET /api/admissions/stats
// @access  Private (Admin)
export const getAdmissionStats = asyncHandler(async (req, res) => {
  const pending = await AdmissionForm.countDocuments({ status: 'pending' });
  const approved = await AdmissionForm.countDocuments({ status: 'approved' });
  const rejected = await AdmissionForm.countDocuments({ status: 'rejected' });

  const stats = {
    pending,
    approved,
    rejected,
    total: pending + approved + rejected,
  };

  res.status(200).json(new ApiResponse(200, stats, 'Admission statistics retrieved successfully'));
});
