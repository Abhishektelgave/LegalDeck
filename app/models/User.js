import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profileImage: String,
  email_verified: { type: Boolean, default: false },
  oauthProvider: String,
  createdDate: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
