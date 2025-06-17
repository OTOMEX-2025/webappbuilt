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
  specialization: { type: String }, // For professionals
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;