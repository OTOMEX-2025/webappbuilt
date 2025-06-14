// models/Patient.js
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  strugglingWith: { type: String },
}, { timestamps: true });

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
export default Patient;