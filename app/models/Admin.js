import mongoose from 'mongoose';

// Admin Schema
const adminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
});

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
