// models/Meeting.js
import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes
  status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
  meetingUrl: { type: String },
  notes: { type: String },
  title: { type: String, required: true }
}, { timestamps: true });

const Meeting = mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
export default Meeting;