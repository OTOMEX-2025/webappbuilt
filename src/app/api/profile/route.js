import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    await dbConnect();
    
    // Check for authorization header
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(user, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }
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
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
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
  
  // Create token
  const token = jwt.sign(
    { userId: user._id, userType: user.userType },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  
  return NextResponse.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      // Add other user fields as needed
    }
  });
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
  
  return NextResponse.json(
    { message: 'User created successfully' },
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
  
  // In a real app, you would generate a reset token and send an email
  // This is a simplified version
  return NextResponse.json(
    { message: 'If an account exists with this email, a reset link has been sent' },
    { status: 200 }
  );
}