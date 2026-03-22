import cron from 'node-cron';
import Fee from '../models/Fee.js';
import FeeStructure from '../models/FeeStructure.js';
import Student from '../models/Student.js';
import { logger } from '../utils/logger.js';

// Calculate late fees daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Running daily late fee calculation...');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all overdue fees
    const overdueFees = await Fee.find({
      status: { $in: ['pending', 'partial'] },
      dueDate: { $lt: today },
    }).populate('student');

    let updatedCount = 0;

    for (const fee of overdueFees) {
      const daysLate = Math.floor((today - fee.dueDate) / (1000 * 60 * 60 * 24));
      const lateFee = daysLate * fee.student.lateFeePerDay;

      if (lateFee !== fee.lateFee) {
        fee.lateFee = lateFee;
        fee.status = 'overdue';
        await fee.save();
        updatedCount++;
      }
    }

    logger.success(`Late fee calculation completed. Updated ${updatedCount} fees.`);
  } catch (error) {
    logger.error(`Error in late fee calculation: ${error.message}`);
  }
});

// Generate monthly fees on 1st of each month at 1 AM
cron.schedule('0 1 1 * *', async () => {
  try {
    logger.info('Running monthly fee generation...');

    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Check if fees already generated for this month
    const existingFees = await Fee.countDocuments({ month: currentMonth });
    if (existingFees > 0) {
      logger.warn('Fees already generated for this month');
      return;
    }

    const activeStudents = await Student.find({ isActive: true });
    const feeStructures = await FeeStructure.find({ isActive: true });

    const feesToCreate = [];
    const dueDate = new Date(currentMonth);
    dueDate.setDate(5); // Due on 5th of each month

    for (const student of activeStudents) {
      const structure = feeStructures.find((s) => s.membershipType === student.membershipType);
      if (!structure) continue;

      let discountAmount = 0;
      if (student.discount.type === 'percentage') {
        discountAmount = (structure.amount * student.discount.value) / 100;
      } else {
        discountAmount = student.discount.value;
      }

      feesToCreate.push({
        student: student._id,
        month: currentMonth,
        baseAmount: structure.amount,
        discount: discountAmount,
        lateFee: 0,
        totalAmount: structure.amount - discountAmount,
        dueDate,
        status: 'pending',
      });
    }

    await Fee.insertMany(feesToCreate);

    logger.success(`Monthly fee generation completed. Created ${feesToCreate.length} fees.`);
  } catch (error) {
    logger.error(`Error in monthly fee generation: ${error.message}`);
  }
});

logger.info('Cron jobs initialized successfully');
