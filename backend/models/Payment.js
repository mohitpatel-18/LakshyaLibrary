import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    fee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Fee',
      required: true,
    },
    receiptNumber: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMode: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cash', 'upi', 'card', 'cheque', 'bank_transfer'],
    },
    transactionId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    remarks: {
      type: String,
    },
    receiptUrl: {
      type: String,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique receipt number
paymentSchema.pre('save', async function (next) {
  if (!this.isNew || this.receiptNumber) {
    return next();
  }

  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const count = await mongoose.model('Payment').countDocuments();
  const sequenceNumber = (count + 1).toString().padStart(5, '0');
  this.receiptNumber = `RCP${year}${month}${sequenceNumber}`;
  next();
});

// Indexes
paymentSchema.index({ student: 1 });
paymentSchema.index({ fee: 1 });
paymentSchema.index({ receiptNumber: 1 }, { unique: true });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
