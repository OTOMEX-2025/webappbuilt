// pages/api/register.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../models/User';

async function connectDb() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect('mongodb connection satring', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { fullName, email, password, userType, licenseNumber, specialization, organizationName, strugglingWith } = req.body;

  try {
    await connectDb();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user based on userType
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userType,
      licenseNumber,
      specialization,
      organizationName,
      strugglingWith,
    });

    // Save the user to the database
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
