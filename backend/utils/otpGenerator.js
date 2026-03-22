import crypto from 'crypto';

// Generate 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Generate OTP with expiry
export const generateOTPWithExpiry = () => {
  const otp = generateOTP();
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;
  const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
  return { otp, otpExpiry };
};

// Verify OTP
export const verifyOTP = (storedOTP, enteredOTP, otpExpiry) => {
  if (!storedOTP || !otpExpiry) {
    return { valid: false, message: 'OTP not found' };
  }

  if (new Date() > new Date(otpExpiry)) {
    return { valid: false, message: 'OTP has expired' };
  }

  if (storedOTP !== enteredOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }

  return { valid: true, message: 'OTP verified successfully' };
};
