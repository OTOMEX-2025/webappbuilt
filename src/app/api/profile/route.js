import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request) {
  await dbConnect();
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('-password');
    return NextResponse.json(user || { message: 'User not found' });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const { operation, ...payload } = data;
    
    switch (operation) {
      case 'login':
        return await handleLogin(data.email, data.password);
      case 'register':
        return await handleRegister(data);
      case 'reset-password':
        return await handleResetPassword(data.email);
      default:
        return NextResponse.json(
          { message: 'Invalid operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await dbConnect();
  try {
    const { operation, ...data } = await request.json();
    
    if (operation !== 'update-profile' || !data.email) {
      return NextResponse.json(
        { message: 'Invalid request' },
        { status: 400 }
      );
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// Helper functions
async function handleLogin({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  // Return all user data except password
  const { password: _, ...userData } = user.toObject();
  return NextResponse.json(userData);
}

async function handleRegister({ 
  fullName, 
  email, 
  password, 
  userType = 'client',
  licenseNumber,
  specialization,
  organizationName,
  strugglingWith,
  ...additionalData
}) {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user with all provided data
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    userType,
    // Professional fields
    ...(userType === 'professional' && { 
      licenseNumber,
      specialization,
      organizationName
    }),
    // Client fields
    ...(userType === 'client' && { 
      strugglingWith 
    }),
    // Any additional fields
    ...additionalData
  });
  
  await newUser.save();
  
  // Return the new user without password
  const { password: _, ...userData } = newUser.toObject();
  
  return NextResponse.json(
    { 
      message: 'User created successfully',
      user: { _id: newUser._id, name, email, userType }
    },
    { status: 201 }
  );
}

async function handleResetPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { message: 'If an account exists, a reset link has been sent' },
      { status: 200 }
    );
  }
  
  return NextResponse.json(
    { message: 'Reset instructions sent to your email' },
    { status: 200 }
  );
}