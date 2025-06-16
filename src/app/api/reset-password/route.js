// app/api/reset-password/route.js
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnect";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, newPassword } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return new Response(JSON.stringify({ 
        message: "No account found with this email address"
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return new Response(JSON.stringify({ 
      message: "Password updated successfully" 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return new Response(JSON.stringify({ 
      message: "Internal server error",
      error: error.message 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}