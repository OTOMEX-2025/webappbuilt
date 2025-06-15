// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['client', 'professional', 'admin'], required: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;