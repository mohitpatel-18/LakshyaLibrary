import { transporter } from '../config/email.js';
import { logger } from './logger.js';
import {
  getWelcomeEmailTemplate,
  getOTPEmailTemplate,
  getPaymentReceiptEmailTemplate,
  getPasswordResetEmailTemplate,
} from './emailTemplates.js';

// Send email function
export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send welcome email with credentials
export const sendWelcomeEmail = async (to, name, studentId, email, password) => {
  const subject = `Welcome to ${process.env.LIBRARY_NAME || 'LakshyaLibrary'}!`;
  const html = getWelcomeEmailTemplate(name, studentId, email, password);
  return await sendEmail(to, subject, html);
};

// Send OTP email
export const sendOTPEmail = async (to, name, otp) => {
  const subject = 'OTP for Account Verification';
  const html = getOTPEmailTemplate(name, otp);
  return await sendEmail(to, subject, html);
};

// Send payment receipt email
export const sendPaymentReceiptEmail = async (to, studentName, receiptNumber, amount, month, paymentMode, receiptPath = null) => {
  const subject = 'Payment Receipt - ' + receiptNumber;
  const html = getPaymentReceiptEmailTemplate(studentName, receiptNumber, amount, month, paymentMode);
  
  const attachments = receiptPath
    ? [
        {
          filename: `Receipt_${receiptNumber}.pdf`,
          path: receiptPath,
        },
      ]
    : [];

  return await sendEmail(to, subject, html, attachments);
};

// Send password reset email
export const sendPasswordResetEmail = async (to, name, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const subject = 'Password Reset Request';
  const html = getPasswordResetEmailTemplate(name, resetUrl);
  return await sendEmail(to, subject, html);
};
