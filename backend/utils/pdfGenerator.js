import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure receipts directory exists
const receiptsDir = path.join(__dirname, '../receipts');
if (!fs.existsSync(receiptsDir)) {
  fs.mkdirSync(receiptsDir, { recursive: true });
}

// Generate payment receipt PDF
export const generatePaymentReceipt = async (paymentId) => {
  try {
    const payment = await Payment.findById(paymentId).populate('student fee');
    if (!payment) {
      throw new Error('Payment not found');
    }

    const student = await Student.findById(payment.student._id).populate('user');
    const fileName = `receipt_${payment.receiptNumber}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Header with library name
    doc.fontSize(24).font('Helvetica-Bold').text(process.env.LIBRARY_NAME || 'LakshyaLibrary', {
      align: 'center',
    });
    doc.fontSize(10).font('Helvetica').text('Library Management System', { align: 'center' });
    doc.moveDown(0.5);

    // Receipt title
    doc.fontSize(18).font('Helvetica-Bold').text('PAYMENT RECEIPT', { align: 'center' });
    doc.moveDown(1);

    // Draw horizontal line
    doc.strokeColor('#667eea').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Receipt details in two columns
    const leftX = 50;
    const rightX = 320;
    let currentY = doc.y;

    // Left column
    doc.fontSize(10).font('Helvetica-Bold').text('Receipt No:', leftX, currentY);
    doc.font('Helvetica').text(payment.receiptNumber, leftX + 100, currentY);
    currentY += 20;

    doc.font('Helvetica-Bold').text('Student Name:', leftX, currentY);
    doc.font('Helvetica').text(student.name, leftX + 100, currentY);
    currentY += 20;

    doc.font('Helvetica-Bold').text('Student ID:', leftX, currentY);
    doc.font('Helvetica').text(student.studentId, leftX + 100, currentY);
    currentY += 20;

    doc.font('Helvetica-Bold').text('Email:', leftX, currentY);
    doc.font('Helvetica').text(student.user.email, leftX + 100, currentY);
    currentY += 20;

    // Right column
    currentY = doc.y - 80; // Reset to top of left column

    doc.font('Helvetica-Bold').text('Date:', rightX, currentY);
    doc.font('Helvetica').text(new Date(payment.paymentDate).toLocaleDateString(), rightX + 80, currentY);
    currentY += 20;

    doc.font('Helvetica-Bold').text('Payment Mode:', rightX, currentY);
    doc
      .font('Helvetica')
      .text(payment.paymentMode.charAt(0).toUpperCase() + payment.paymentMode.slice(1), rightX + 80, currentY);
    currentY += 20;

    if (payment.paymentMethod) {
      doc.font('Helvetica-Bold').text('Method:', rightX, currentY);
      doc
        .font('Helvetica')
        .text(payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1), rightX + 80, currentY);
      currentY += 20;
    }

    if (payment.transactionId) {
      doc.font('Helvetica-Bold').text('Transaction ID:', rightX, currentY);
      doc.font('Helvetica').text(payment.transactionId, rightX + 80, currentY);
    }

    doc.moveDown(3);

    // Payment details table
    const tableTop = doc.y + 20;
    doc.strokeColor('#667eea').lineWidth(2).moveTo(50, tableTop).lineTo(550, tableTop).stroke();

    doc.moveDown(1);

    // Table headers
    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#667eea')
      .text('Description', leftX, doc.y, { width: 200 })
      .text('Amount (₹)', rightX + 80, doc.y - 11, { width: 100, align: 'right' });

    doc.moveDown(0.5);
    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table rows
    doc.fillColor('#000000').font('Helvetica');

    const fee = payment.fee;
    const month = new Date(fee.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    doc.fontSize(10).text(`Monthly Fee - ${month}`, leftX, doc.y);
    doc.text(`₹${fee.baseAmount.toFixed(2)}`, rightX + 80, doc.y - 11, { width: 100, align: 'right' });
    doc.moveDown(0.5);

    if (fee.discount > 0) {
      doc.text('Discount', leftX, doc.y);
      doc.text(`- ₹${fee.discount.toFixed(2)}`, rightX + 80, doc.y - 11, { width: 100, align: 'right' });
      doc.moveDown(0.5);
    }

    if (fee.lateFee > 0) {
      doc.text('Late Fee', leftX, doc.y);
      doc.text(`₹${fee.lateFee.toFixed(2)}`, rightX + 80, doc.y - 11, { width: 100, align: 'right' });
      doc.moveDown(0.5);
    }

    doc.strokeColor('#cccccc').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Total
    doc.fontSize(12).font('Helvetica-Bold').text('Total Amount Paid:', leftX, doc.y);
    doc.fontSize(14).fillColor('#10b981').text(`₹${payment.amount.toFixed(2)}`, rightX + 80, doc.y - 14, {
      width: 100,
      align: 'right',
    });

    doc.moveDown(2);

    // Remarks if any
    if (payment.remarks) {
      doc.fillColor('#000000').fontSize(10).font('Helvetica-Bold').text('Remarks:', leftX, doc.y);
      doc.font('Helvetica').text(payment.remarks, leftX, doc.y + 15, { width: 500 });
      doc.moveDown(1);
    }

    // Footer
    doc.moveDown(3);
    doc.strokeColor('#667eea').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#666666')
      .text('This is a computer-generated receipt and does not require a signature.', { align: 'center' });
    doc.text(`Generated on ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.text(`Thank you for your payment!`, { align: 'center' });

    // Finalize PDF
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        logger.info(`Receipt generated: ${fileName}`);
        resolve(filePath);
      });
      stream.on('error', reject);
    });
  } catch (error) {
    logger.error(`Error generating receipt: ${error.message}`);
    throw error;
  }
};

// Generate student ID card PDF
export const generateStudentIDCard = async (studentId) => {
  try {
    const student = await Student.findById(studentId).populate('user seat');
    if (!student) {
      throw new Error('Student not found');
    }

    const fileName = `id_card_${student.studentId}.pdf`;
    const filePath = path.join(receiptsDir, fileName);

    // Generate QR code
    const qrData = JSON.stringify({
      studentId: student.studentId,
      name: student.name,
      email: student.user.email,
    });
    const qrCodeDataURL = await QRCode.toDataURL(qrData);

    const doc = new PDFDocument({ size: [242, 153], margin: 0 }); // ID card size (CR80)
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Background gradient
    doc.rect(0, 0, 242, 153).fill('#667eea');
    doc.rect(0, 40, 242, 113).fill('#ffffff');

    // Header
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#ffffff').text(process.env.LIBRARY_NAME || 'LakshyaLibrary', {
      align: 'center',
      y: 10,
    });
    doc.fontSize(8).font('Helvetica').text('Student ID Card', { align: 'center' });

    // Student details
    doc.fillColor('#000000');
    doc.fontSize(10).font('Helvetica-Bold').text(student.name, 15, 50, { width: 150 });
    doc.fontSize(8).font('Helvetica').text(`ID: ${student.studentId}`, 15, 70);
    doc.text(`Email: ${student.user.email}`, 15, 82, { width: 150 });

    if (student.seat) {
      doc.text(`Seat: ${student.seat.seatNumber}`, 15, 94);
    }

    // Validity
    if (student.validityPeriod && student.validityPeriod.to) {
      doc.fontSize(7).text(`Valid Until: ${new Date(student.validityPeriod.to).toLocaleDateString()}`, 15, 106);
    }

    // QR Code
    doc.image(qrCodeDataURL, 170, 50, { width: 60, height: 60 });

    // Footer
    doc.fontSize(6).fillColor('#666666').text('Authorized ID Card', { align: 'center', y: 135 });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        logger.info(`ID card generated: ${fileName}`);
        resolve(filePath);
      });
      stream.on('error', reject);
    });
  } catch (error) {
    logger.error(`Error generating ID card: ${error.message}`);
    throw error;
  }
};
