import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    studentId: {
      type: String,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    membershipType: {
      type: String,
      enum: ['fulltime', 'parttime'],
      required: true,
    },
    photo: {
      type: String, // URL to uploaded photo
    },
    idProof: {
      type: String, // URL to uploaded ID proof
    },
    seat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
      default: null,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    validityPeriod: {
      from: {
        type: Date,
        default: Date.now,
      },
      to: {
        type: Date,
      },
    },
    discount: {
      type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage',
      },
      value: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    lateFeePerDay: {
      type: Number,
      default: 10,
      min: 0,
    },
    totalDue: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique student ID
studentSchema.pre('validate', async function (next) {
  if (!this.studentId) {
    const year = new Date().getFullYear().toString().slice(-2);
    const count = await mongoose.model('Student').countDocuments();
    const sequenceNumber = (count + 1).toString().padStart(4, '0');
    this.studentId = `LIB${year}${sequenceNumber}`;
  }
  next();
});

// Indexes for better query performance
studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ user: 1 }, { unique: true });
studentSchema.index({ isActive: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
