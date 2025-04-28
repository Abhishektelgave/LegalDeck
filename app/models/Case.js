import mongoose from 'mongoose';

// Document Schema
const documentSchema = new mongoose.Schema({
  fileName: { type: String },
  path: { type: String },
  from: { type: String, enum: ['Lawyer', 'User'], default: 'User' },
  status: { type: String, enum: ['Pending', 'Signed', 'Unsigned'], default: 'Unsigned' },
  needsESign: { type: Boolean, default: false },
}, { _id: true });

// Requested Document Schema
const requestSchema = new mongoose.Schema({
  fileName: { type: String },
  from: { type: String, enum: ['Lawyer', 'User'], default: 'Lawyer' },
  path: { type: String, default: '' },
  needsESign: { type: Boolean, default: false },
  fulfilled: { type: Boolean, default: false },
}, { _id: true });

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
  category: { type: String },
  dateStarted: { type: Date, default: Date.now },
  status: { type: String, enum: ['Not Started', 'Active', 'Resolved', 'Rejected'], default: 'Not Started' },
  caseProgress: { type: String, default: 'Not Initiated' },
  documents: [documentSchema],          // Now documents will have unique _id
  requestedDocuments: [requestSchema],  // Now requestedDocuments will have unique _id
  desc: { type: String },
  messages: [messageSchema],
  fee: { type: Number },
  payment: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
