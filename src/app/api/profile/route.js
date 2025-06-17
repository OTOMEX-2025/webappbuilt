import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request) {
  await dbConnect();
  try {
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
  await dbConnect();
  try {
    const { operation, ...data } = await request.json();

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

// Helper Functions
async function handleLogin(email, password) {
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

  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
  };

  return NextResponse.json(userData);
}

async function handleRegister({ name, email, password, userType = 'client' }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, userType });
  await newUser.save();

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

  // In production: Send an actual reset email here
  return NextResponse.json(
    { message: 'Reset instructions sent to your email' },
    { status: 200 }
  );
}