// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Return all user data except password
    const userData = user.toObject();
    delete userData.password;

    return NextResponse.json({ 
      message: "Login successful!", 
      token: "fake-jwt-token",
      user: userData
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}