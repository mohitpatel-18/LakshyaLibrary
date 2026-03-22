import crypto from 'crypto';
import User from '../models/User.js';
import Student from '../models/Student.js';
import { ApiResponse, ApiError } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateTokens, verifyRefreshToken } from '../utils/generateToken.js';
import { generateOTPWithExpiry, verifyOTP } from '../utils/otpGenerator.js';
import { sendOTPEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { logger } from '../utils/logger.js';

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { emailOrStudentId, password } = req.body;

  // Check if user exists by email or student ID
  let user;
  let student;

  // Check if it's an email
  if (emailOrStudentId.includes('@')) {
    user = await User.findOne({ email: emailOrStudentId.toLowerCase() }).select('+password');
  } else {
    // It's a student ID
    student = await Student.findOne({ studentId: emailOrStudentId.toUpperCase() }).populate('user');
    user = student ? await User.findById(student.user._id).select('+password') : null;
  }

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact admin.');
  }

  // Validate password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  // Check if OTP verification is needed (first time login)
  if (!user.isOtpVerified && user.role === 'student') {
    // Generate and send OTP
    const { otp, otpExpiry } = generateOTPWithExpiry();
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Get student details for name
    if (!student) {
      student = await Student.findOne({ user: user._id });
    }

    // Send OTP email
    await sendOTPEmail(user.email, student?.name || 'User', otp);

    return res.status(200).json(
      new ApiResponse(200, { requiresOTP: true, userId: user._id }, 'OTP sent to your email')
    );
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  // Get user details based on role
  let userData = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  if (user.role === 'student' && !student) {
    student = await Student.findOne({ user: user._id }).populate('seat');
  }

  if (student) {
    userData.student = student;
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userData,
        accessToken,
        refreshToken,
      },
      'Login successful'
    )
  );
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOTPController = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select('+otp +otpExpiry');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const verification = verifyOTP(user.otp, otp, user.otpExpiry);

  if (!verification.valid) {
    throw new ApiError(400, verification.message);
  }

  // Mark OTP as verified
  user.isOtpVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  // Get student details
  const student = await Student.findOne({ user: user._id }).populate('seat');

  const userData = {
    id: user._id,
    email: user.email,
    role: user.role,
    student: student || null,
  };

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userData,
        accessToken,
        refreshToken,
      },
      'OTP verified successfully'
    )
  );
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOTP = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Generate new OTP
  const { otp, otpExpiry } = generateOTPWithExpiry();
  user.otp = otp;
  user.otpExpiry = otpExpiry;
  await user.save();

  // Get student details
  const student = await Student.findOne({ user: user._id });

  // Send OTP email
  await sendOTPEmail(user.email, student?.name || 'User', otp);

  res.status(200).json(new ApiResponse(200, null, 'OTP resent successfully'));
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user and verify refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');

  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Generate new tokens
  const tokens = generateTokens(user._id);

  // Update refresh token
  user.refreshToken = tokens.refreshToken;
  await user.save();

  res.status(200).json(new ApiResponse(200, tokens, 'Token refreshed successfully'));
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.refreshToken = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Logout successful'));
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    // Don't reveal if user exists or not
    return res.status(200).json(new ApiResponse(200, null, 'If the email exists, a reset link has been sent'));
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Get student/admin name
  let name = 'User';
  if (user.role === 'student') {
    const student = await Student.findOne({ user: user._id });
    name = student?.name || 'User';
  } else {
    name = 'Admin';
  }

  // Send reset email
  await sendPasswordResetEmail(user.email, name, resetToken);

  res.status(200).json(new ApiResponse(200, null, 'Password reset link sent to your email'));
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with valid reset token
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpiry: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpiry');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
});

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  let userData = {
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    isActive: req.user.isActive,
  };

  if (req.user.role === 'student') {
    const student = await Student.findOne({ user: req.user._id }).populate('seat');
    userData.student = student;
  }

  res.status(200).json(new ApiResponse(200, userData, 'User details retrieved successfully'));
});
