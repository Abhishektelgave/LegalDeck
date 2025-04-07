import mongoose from 'mongoose';

// Further can be modified based on needs
const LawyerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  ratings: Number,
  roles: [String],
  email_verified: Boolean,
  oauthProvider: String,
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Lawyer || mongoose.model('Lawyer', LawyerSchema);

