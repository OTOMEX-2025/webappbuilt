// models/User.js
const mongoose = require('mongoose');

// Define schema for the user
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['client', 'professional', 'admin'], required: true },
  licenseNumber: { type: String }, // Only for professionals
  specialization: { type: String }, // Only for professionals
  organizationName: { type: String }, // Only for admins
  strugglingWith: { type: String }, // Only for clients
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
