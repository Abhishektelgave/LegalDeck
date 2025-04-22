import mongoose from 'mongoose';

// Lawyer Schema
const LawyerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  ratings: { type: Array, default: [] },
  categories: { type: Object, default: {} },
  fileName: String,
  lawyer_verified: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  email_verified: { type: Boolean, default: false },
  close_appoitment: { type: Boolean, default: false },
  oauthProvider: String,
  upi: { type: String, default: 'null' },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Lawyer || mongoose.model('Lawyer', LawyerSchema);
