import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import bcrypt from "bcryptjs";
import Patient from "../../../models/Patient";
import Therapist from "../../../models/Therapist";
import {sendSubscriptionEmail , sendResetPassEmail} from "../../../utils/email"

export async function GET(request) {
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
    
    const { operation, ...payload } = data;
    
    switch (operation) {
      case 'login':
        return handleLogin(payload);
      case 'register':
        return handleRegister(payload);
      case 'reset-password':
        return handleResetPassword(payload);
      case 'update-password':
        return handleUpdatePassword(payload);
      case 'subscribe':
        return handleSubscribe(payload);
      case 'unsubscribe':
        return handleUnsubscribe(payload);
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

// app/api/profile/route.js
export async function PUT(request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Handle different operations with different requirements
    switch (data.operation) {
      case 'subscribe':
      case 'unsubscribe':
        // For subscriptions, require userId instead of email
        if (!data.userId) {
          return NextResponse.json(
            { message: 'User ID is required for subscription operations' },
            { status: 400 }
          );
        }
        return data.operation === 'subscribe' 
          ? handleSubscribe(data) 
          : handleUnsubscribe(data);
        
      case 'update-profile':
        // Only profile updates require email
        if (!data.email) {
          return NextResponse.json(
            { message: 'Email is required for profile updates' },
            { status: 400 }
          );
        }
        return handleProfileUpdate(data);
        
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

// Separate handler for profile updates
async function handleProfileUpdate(data) {
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
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Start a session for transaction
  const session = await User.startSession();
  session.startTransaction();
  
  try {
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
    
    await newUser.save({ session });
    
    // Create role-specific document based on userType
    if (userType === 'professional') {
      const newTherapist = new Therapist({
        userId: newUser._id,
        fullName,
        email,
        licenseNumber,
        specialization,
        organization: organizationName,
        ...additionalData
      });
      await newTherapist.save({ session });
    } else if (userType === 'client') {
      const newPatient = new Patient({
        userId: newUser._id,
        fullName,
        email,
        strugglingWith,
        ...additionalData
      });
      await newPatient.save({ session });
    }
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Return the new user without password
    const { password: _, ...userData } = newUser.toObject();
    
    return NextResponse.json(
      { message: 'User created successfully', user: userData },
      { status: 201 }
    );
  } catch (error) {
    // If an error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();
    
    throw error;
  }
}

async function handleResetPassword({ email }) {
  const user = await User.findOne({ email });
  
  if (!user) {
    return NextResponse.json(
      { message: 'If an account exists with this email, a reset link has been sent' },
      { status: 200 }
    );
  }

  // Generate a reset code
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store the reset code with expiration (15 minutes)
  user.resetPasswordToken = resetCode;
  user.resetPasswordExpires = Date.now() + 900000; // 15 minutes
  
  await user.save();

  // Send email
  await sendResetPassEmail(email, resetCode);

  return NextResponse.json(
    { message: 'If an account exists with this email, a reset link has been sent' },
    { status: 200 }
  );
}

// Add a new function to handle password update
async function handleUpdatePassword({ email, code, newPassword }) {
  const user = await User.findOne({ 
    email,
    resetPasswordToken: code,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid or expired reset code' },
      { status: 400 }
    );
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update password and clear reset token
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  
  await user.save();

  return NextResponse.json(
    { message: 'Password updated successfully' },
    { status: 200 }
  );
}

async function handleSubscribe({ userId, plan, paymentMethod }) {
  try {
    // Validate userId exists
    if (!userId) {
      throw new Error('User ID is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }



    // Check if THIS user has an existing subscription
    const existingSubscription = await Subscription.findOne({ user: userId });
    if (existingSubscription) {
      return NextResponse.json(
        { 
          success: false,
          message: 'You already have an active subscription' 
        },
        { status: 400 }
      );
    }

    // Create new subscription
    const newSubscription = new Subscription({
      user: userId,
      plan,
      paymentMethod,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    await newSubscription.save();
    
    // Update user reference
    await User.findByIdAndUpdate(
      userId,
      { subscription: newSubscription._id }
    );

    // Send email (non-blocking)
    sendSubscriptionEmail(user.email, plan)
      .then(success => console.log(success ? '📧 Email sent' : '❌ Email failed'))
      .catch(err => console.error('⚠️ Email error:', err));

    return NextResponse.json({
      success: true,
      subscription: newSubscription,
      message: 'Subscription created successfully'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    // More specific error messages
    let errorMessage = error.message;
    if (error.code === 11000) {
      errorMessage = 'Subscription conflict detected. Please try again.';
      // Consider automatic cleanup here if needed
      await Subscription.deleteMany({ user: null });
    }

    return NextResponse.json(
      { 
        success: false,
        message: errorMessage 
      },
      { status: 500 }
    );
  }
}

async function handleUnsubscribe({ userId }) {
  try {
    const user = await User.findById(userId);
    if (!user || !user.subscription) {
      return NextResponse.json(
        { message: 'No active subscription found' },
        { status: 404 }
      );
    }

    await Subscription.findByIdAndUpdate(
      user.subscription,
      { status: 'canceled' }
    );

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed'
    });
  } catch (error) {
    console.error('Unsubscription error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
