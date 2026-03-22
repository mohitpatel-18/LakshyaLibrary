import mongoose from 'mongoose';

const admissionFormSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
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
    seatPreference: {
      type: Number,
    },
    idProof: {
      type: String, // URL to uploaded ID proof
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    remarks: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    convertedToStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
admissionFormSchema.index({ status: 1 });
admissionFormSchema.index({ email: 1 });

const AdmissionForm = mongoose.model('AdmissionForm', admissionFormSchema);

export default AdmissionForm;
