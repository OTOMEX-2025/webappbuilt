// models/Therapist.js
import mongoose from "mongoose";

const therapistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  specialization: { type: String, required: true },
}, { timestamps: true });

const Therapist = mongoose.models.Therapist || mongoose.model('Therapist', therapistSchema);
export default Therapist;