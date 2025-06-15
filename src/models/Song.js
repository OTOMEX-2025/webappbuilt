// models/Song.js
import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  duration: { type: Number, required: true }, // in seconds
  url: { type: String, required: true },
  category: { type: String },
  mood: { type: String },
  therapeuticUse: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Song = mongoose.models.Song || mongoose.model('Song', songSchema);
export default Song;