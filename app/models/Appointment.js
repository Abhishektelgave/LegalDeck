  import mongoose from "mongoose";

  // Appointment Schema
  const AppointmentSchema = new mongoose.Schema({
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lawyer',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    payment: {
      type: String,
      enum: ['pending', 'completed', 'rejected'],
      default: 'pending',
    },
  }, { timestamps: true });

  export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema)
