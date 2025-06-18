// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['client', 'professional', 'admin'], required: true },
  profilePicture: { type: String },
  phoneNumber: { type: String },
  address: { type: String },
  bio: { type: String },
  specialization: { type: String },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription',
    default: null
  }
}, { 
  timestamps: true,
  strictPopulate: false

});

// Add method to check subscription status
userSchema.methods.isSubscribed = async function() {
  if (!this.subscription) return false;
  
  const sub = await mongoose.model('Subscription').findById(this.subscription);
  return sub && sub.status === 'active';
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;