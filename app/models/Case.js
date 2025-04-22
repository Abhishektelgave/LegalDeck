import mongoose from 'mongoose';

// Document Schema
const documentSchema = new mongoose.Schema({
  name: String,
  url: String,
  from: String,
  status: String,
  needsESign: Boolean,
});

// Case Schema
const caseSchema = new mongoose.Schema({
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
  category: String,
  dateStarted: Date,
  status: String,
  documents: [documentSchema],
  Disc: String,
});

export default mongoose.models.Case || mongoose.model('Case', caseSchema);
