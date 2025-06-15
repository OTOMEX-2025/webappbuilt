// models/Chat.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['patient', 'bot'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversation: [messageSchema],
  lastActive: { type: Date, default: Date.now },
  context: { type: mongoose.Schema.Types.Mixed } // for storing any conversation context
}, { timestamps: true });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;