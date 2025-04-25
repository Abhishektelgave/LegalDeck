import mongoose from 'mongoose';

// Document Schema
const documentSchema = new mongoose.Schema({
  fileName: String,
  path: String,
  from: { type: String, enum: ['Lawyer', 'User'], default: 'User' },
  status: { type: String, enum: ['Pending', 'Signed', 'Unsinged'], default: 'Unsinged' },
  needsESign: { type: Boolean, default: false },
}, { _id: false });

const requestSchema = new mongoose.Schema({
  fileName: String,
  needsESign: { type: Boolean, default: false },
  fulfilled: { type: Boolean, default: false },
}, { _id: false });

// Message Schema
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderRole: { type: String, enum: ['Lawyer', 'User'], required: true },
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
  requestedDocuments: [requestSchema],
  desc: String,
  messages: [messageSchema],
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
