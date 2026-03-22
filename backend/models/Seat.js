import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'occupied', 'reserved'],
      default: 'available',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
    },
    assignedDate: {
      type: Date,
    },
    position: {
      row: Number,
      col: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
seatSchema.index({ seatNumber: 1 }, { unique: true });
seatSchema.index({ status: 1 });

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
