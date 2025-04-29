import mongoose from "mongoose";
const { Schema } = mongoose;

const transitionSchema = new Schema({
    razorpay_order_id: { type: String, required: true },
    amount: { type: Number, required: true },
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
    createdDate: { type: Date, default: Date.now },
    done: { type: Boolean, default: false },
});

export default mongoose.models.Transition || mongoose.model('Transition', transitionSchema);