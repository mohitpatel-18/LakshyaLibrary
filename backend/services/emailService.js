import { transporter } from '../config/email.js';
import { logger } from '../utils/logger.js';

/**
 * Email Templates
 */
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to Lashya Library!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Lashya Library!</h1>
        </div>
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hello ${data.name},</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            We're thrilled to have you join our library community! Your account has been successfully created.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2d3748;"><strong>Student ID:</strong> ${data.studentId}</p>
            <p style="margin: 10px 0; color: #2d3748;"><strong>Email:</strong> ${data.email}</p>
          </div>
          <p style="color: #4a5568; line-height: 1.6;">
            You can now log in and access all library facilities.
          </p>
          <a href="${process.env.FRONTEND_URL}/login" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Login Now
          </a>
        </div>
        <div style="background: #2d3748; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p>© 2026 Lashya Library. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  feeReminder: (data) => ({
    subject: 'Fee Payment Reminder',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Fee Payment Reminder</h1>
        </div>
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hello ${data.name},</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            This is a friendly reminder that your library fee payment is due.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #2d3748;"><strong>Amount Due:</strong> ₹${data.amount}</p>
            <p style="margin: 10px 0; color: #2d3748;"><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          <p style="color: #4a5568; line-height: 1.6;">
            Please make the payment at your earliest convenience to avoid late fees.
          </p>
          <a href="${process.env.FRONTEND_URL}/student/fees" 
             style="display: inline-block; background: #f5576c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Pay Now
          </a>
        </div>
      </div>
    `,
  }),

  seatAssignment: (data) => ({
    subject: 'Seat Assignment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Seat Assigned!</h1>
        </div>
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hello ${data.name},</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            Great news! Your seat has been assigned.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #718096;">Your Seat Number</p>
            <h1 style="margin: 10px 0; color: #4facfe; font-size: 48px;">${data.seatNumber}</h1>
          </div>
          <p style="color: #4a5568; line-height: 1.6;">
            You can now use this seat for your study sessions. Happy studying!
          </p>
        </div>
      </div>
    `,
  }),

  otp: (data) => ({
    subject: 'Your OTP for Login',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verification Code</h1>
        </div>
        <div style="padding: 30px; background: #f7fafc;">
          <h2 style="color: #2d3748;">Hello ${data.name},</h2>
          <p style="color: #4a5568; line-height: 1.6;">
            Your OTP for login verification is:
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h1 style="margin: 0; color: #43e97b; font-size: 48px; letter-spacing: 10px;">${data.otp}</h1>
          </div>
          <p style="color: #4a5568; line-height: 1.6;">
            This OTP will expire in 10 minutes. Do not share it with anyone.
          </p>
        </div>
      </div>
    `,
  }),
};

/**
 * Send email using template
 */
export const sendEmail = async (to, templateName, templateData) => {
  try {
    if (!transporter) {
      logger.warn('Email transporter not configured. Skipping email send.');
      return { success: false, message: 'Email not configured' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Email template "${templateName}" not found`);
    }

    const { subject, html } = template(templateData);

    const info = await transporter.sendMail({
      from: `"Lashya Library" <${process.env.EMAIL_FROM || 'noreply@lakshyalibrary.com'}>`,
      to,
      subject,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Failed to send email: ${error.message}`);
    throw error;
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (recipients, templateName, templateData) => {
  const results = await Promise.allSettled(
    recipients.map(recipient =>
      sendEmail(recipient.email, templateName, {
        ...templateData,
        ...recipient,
      })
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  logger.info(`Bulk email sent: ${successful} successful, ${failed} failed`);
  return { successful, failed, results };
};

/**
 * Automated email triggers
 */
export const automatedEmails = {
  // Send welcome email when student joins
  sendWelcomeEmail: async (student) => {
    return sendEmail(student.user.email, 'welcome', {
      name: student.name,
      studentId: student.studentId,
      email: student.user.email,
    });
  },

  // Send fee reminder
  sendFeeReminder: async (student, fee) => {
    return sendEmail(student.user.email, 'feeReminder', {
      name: student.name,
      amount: fee.amount,
      dueDate: new Date(fee.dueDate).toLocaleDateString(),
    });
  },

  // Send seat assignment notification
  sendSeatAssignment: async (student, seatNumber) => {
    return sendEmail(student.user.email, 'seatAssignment', {
      name: student.name,
      seatNumber,
    });
  },

  // Send OTP
  sendOTP: async (email, otp, name = 'User') => {
    return sendEmail(email, 'otp', { name, otp });
  },
};

export default { sendEmail, sendBulkEmails, automatedEmails };
