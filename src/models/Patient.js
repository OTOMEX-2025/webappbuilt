// models/Patient.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  lastVisited: { type: Date },
  lastVisitedModule: { type: String } // could be 'songs', 'games', 'articles', etc.
});

const mediaActivitySchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  strugglingWith: { type: String },
  progress: { type: progressSchema, default: () => ({}) },
  recentlyPlayedSongs: [mediaActivitySchema],
  frequentlyPlayedSongs: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    playCount: { type: Number, default: 1 }
  }],
  recentlyPlayedGames: [mediaActivitySchema],
  frequentlyPlayedGames: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    playCount: { type: Number, default: 1 }
  }],
  recentlyReadArticles: [mediaActivitySchema],
  frequentlyReadArticles: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    readCount: { type: Number, default: 1 }
  }],
  meetingHistory: [{
    meetingId: { type: mongoose.Schema.Types.ObjectId, required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { type: Number } // in minutes
  }]
}, { timestamps: true });

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);
export default Patient;