import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema(
  {
    membershipType: {
      type: String,
      enum: ['fulltime', 'parttime'],
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
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

const FeeStructure = mongoose.model('FeeStructure', feeStructureSchema);

export default FeeStructure;
