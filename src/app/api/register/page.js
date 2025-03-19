import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';

async function connectDb() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await connectDb();

    const { fullName, email, password, userType, ...optionalFields } = req.body;

    // ✅ Ensure required fields per userType
    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Include only fields that are relevant to the userType
    const userData = { fullName, email, password: hashedPassword, userType };

    if (userType === 'client') {
      userData.strugglingWith = optionalFields.strugglingWith || '';
    } else if (userType === 'professional') {
      if (!optionalFields.licenseNumber || !optionalFields.specialization) {
        return res.status(400).json({ message: 'Missing professional details' });
      }
      userData.licenseNumber = optionalFields.licenseNumber;
      userData.specialization = optionalFields.specialization;
    } else if (userType === 'admin') {
      if (!optionalFields.organizationName) {
        return res.status(400).json({ message: 'Missing organization name' });
      }
      userData.organizationName = optionalFields.organizationName;
    }

    const newUser = new User(userData);
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
