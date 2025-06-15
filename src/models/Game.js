// models/Game.js
import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String },
  difficultyLevel: { type: String },
  therapeuticUse: { type: String },
  estimatedDuration: { type: Number }, // in minutes
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Game = mongoose.models.Game || mongoose.model('Game', gameSchema);
export default Game;