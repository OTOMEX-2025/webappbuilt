import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "../../../models/User";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Parse request body correctly
    const body = await request.json();
    const { fullName, email, password, userType, ...optionalFields } = body;

    if (!fullName || !email || !password || !userType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = { fullName, email, password: hashedPassword, userType };

    if (userType === "client") {
      userData.strugglingWith = optionalFields.strugglingWith || "";
    } else if (userType === "professional") {
      if (!optionalFields.licenseNumber || !optionalFields.specialization) {
        return NextResponse.json({ message: "Missing professional details" }, { status: 400 });
      }
      userData.licenseNumber = optionalFields.licenseNumber;
      userData.specialization = optionalFields.specialization;
    }

    const newUser = new User(userData);
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
