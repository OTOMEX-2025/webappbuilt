import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Get email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user, { status: 200 });
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
    
    // Determine the operation type
    const { operation, ...payload } = data;
    
    switch (operation) {
      case 'login':
        return handleLogin(payload);
      case 'register':
        return handleRegister(payload);
      case 'reset-password':
        return handleResetPassword(payload);
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
  try {
    await dbConnect();
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: data.email },
      { $set: data },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// Helper functions for specific operations
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
  
  // Return user data without password
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    // Add other user fields as needed
  };
  
  return NextResponse.json(userData);
}

async function handleRegister({ name, email, password, userType = 'client' }) {
  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create user
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    userType
  });
  
  await newUser.save();
  
  // Return the new user without password
  const userData = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    userType: newUser.userType
  };
  
  return NextResponse.json(
    { message: 'User created successfully', user: userData },
    { status: 201 }
  );
}

async function handleResetPassword({ email }) {
  const user = await User.findOne({ email });
  
  if (!user) {
    return NextResponse.json(
      { message: 'If an account exists with this email, a reset link has been sent' },
      { status: 200 }
    );
  }
  
  // Simplified reset password response
  return NextResponse.json(
    { message: 'If an account exists with this email, a reset link has been sent' },
    { status: 200 }
  );
}