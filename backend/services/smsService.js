import twilio from 'twilio';
import { logger } from '../utils/logger.js';

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  logger.info('Twilio SMS service initialized');
} else {
  logger.warn('Twilio credentials not found. SMS functionality disabled.');
}

/**
 * SMS Templates
 */
const smsTemplates = {
  welcome: (data) => 
    `Welcome to Lashya Library, ${data.name}! Your Student ID: ${data.studentId}. Login at ${process.env.FRONTEND_URL}`,

  feeReminder: (data) =>
    `Hi ${data.name}, your library fee of ₹${data.amount} is due on ${data.dueDate}. Please pay soon to avoid late charges.`,

  seatAssignment: (data) =>
    `Congratulations ${data.name}! Your seat #${data.seatNumber} has been assigned. Happy studying!`,

  otp: (data) =>
    `Your OTP for Lashya Library login is: ${data.otp}. Valid for 10 minutes. Do not share with anyone.`,

  paymentConfirmation: (data) =>
    `Payment received! ₹${data.amount} paid successfully. Receipt: ${data.receiptNumber}. Thank you!`,

  admissionApproved: (data) =>
    `Great news ${data.name}! Your admission has been approved. Student ID: ${data.studentId}. Welcome to Lashya Library!`,
};

/**
 * Send SMS
 */
export const sendSMS = async (to, templateName, templateData) => {
  try {
    if (!twilioClient) {
      logger.warn('Twilio not configured. Skipping SMS send.');
      return { success: false, message: 'SMS not configured' };
    }

    // Format phone number (add +91 if not present)
    const formattedPhone = to.startsWith('+') ? to : `+91${to}`;

    const template = smsTemplates[templateName];
    if (!template) {
      throw new Error(`SMS template "${templateName}" not found`);
    }

    const message = template(templateData);

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    logger.info(`SMS sent: ${result.sid}`);
    return { success: true, messageSid: result.sid };
  } catch (error) {
    logger.error(`Failed to send SMS: ${error.message}`);
    throw error;
  }
};

/**
 * Send bulk SMS
 */
export const sendBulkSMS = async (recipients, templateName, templateData) => {
  const results = await Promise.allSettled(
    recipients.map(recipient =>
      sendSMS(recipient.phone, templateName, {
        ...templateData,
        ...recipient,
      })
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  logger.info(`Bulk SMS sent: ${successful} successful, ${failed} failed`);
  return { successful, failed, results };
};

/**
 * Automated SMS triggers
 */
export const automatedSMS = {
  // Send welcome SMS
  sendWelcomeSMS: async (student) => {
    return sendSMS(student.phone, 'welcome', {
      name: student.name,
      studentId: student.studentId,
    });
  },

  // Send fee reminder SMS
  sendFeeReminderSMS: async (student, fee) => {
    return sendSMS(student.phone, 'feeReminder', {
      name: student.name,
      amount: fee.amount,
      dueDate: new Date(fee.dueDate).toLocaleDateString(),
    });
  },

  // Send seat assignment SMS
  sendSeatAssignmentSMS: async (student, seatNumber) => {
    return sendSMS(student.phone, 'seatAssignment', {
      name: student.name,
      seatNumber,
    });
  },

  // Send OTP SMS
  sendOTPSMS: async (phone, otp, name = 'User') => {
    return sendSMS(phone, 'otp', { name, otp });
  },

  // Send payment confirmation SMS
  sendPaymentConfirmationSMS: async (student, payment) => {
    return sendSMS(student.phone, 'paymentConfirmation', {
      name: student.name,
      amount: payment.amount,
      receiptNumber: payment.receiptNumber,
    });
  },

  // Send admission approval SMS
  sendAdmissionApprovalSMS: async (student) => {
    return sendSMS(student.phone, 'admissionApproved', {
      name: student.name,
      studentId: student.studentId,
    });
  },
};

export default { sendSMS, sendBulkSMS, automatedSMS };
