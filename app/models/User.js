import mongoose from 'mongoose';

// Further can be modified based on needs
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  profileImage: String,
  email_verified: Boolean,
  oauthProvider: String,
  createdDate: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
