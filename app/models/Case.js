import mongoose from 'mongoose';

// Document Schema
const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  from: String,
  status: String,
  needsESign: Boolean,
}, { _id: false });

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderRole: { type: String, enum: ['User', 'Lawyer'], required: true },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

// Case Schema
const caseSchema = new mongoose.Schema({
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: String,
  dateStarted: { type: Date, default: Date.now },
  status: { type: String, enum: ['Not Started', 'Active', 'Resolved', 'Rejected'], default: 'Not Started' },
  caseProgress: { type: String, default: 'Not Initiated' },
  documents: [documentSchema],
  desc: String,
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
