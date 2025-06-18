// models/Subscription.js
import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId: {  // Changed from 'user' to 'userId'
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    alias: 'user'
  },
  plan: {
    type: String,
    required: [true, 'Plan is required'],
    enum: ['basic', 'standard', 'premium', 'enterprise']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['card', 'paypal', 'bank_transfer']
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date
}, { timestamps: true });

subscriptionSchema.index({ userId: 1, plan: 1 }, { unique: true });
export default mongoose.models.Subscription || 
       mongoose.model('Subscription', subscriptionSchema);