import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import Patient from "../../../models/Patient";
import Therapist from "../../../models/Therapist";

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { fullName, email, password, userType, ...optionalFields } = body;

    if (!fullName || !email || !password || !userType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user first
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userType
    });
    await newUser.save();

    // Then create role-specific document
    if (userType === "client") {
      const newPatient = new Patient({
        userId: newUser._id,
        fullName,
        email,
        strugglingWith: optionalFields.strugglingWith || ""
      });
      await newPatient.save();
    } 
    else if (userType === "professional") {
      if (!optionalFields.licenseNumber || !optionalFields.specialization) {
        // Rollback user creation if professional details are missing
        await User.deleteOne({ _id: newUser._id });
        return NextResponse.json({ message: "Missing professional details" }, { status: 400 });
      }
      
      const newTherapist = new Therapist({
        userId: newUser._id,
        fullName,
        email,
        licenseNumber: optionalFields.licenseNumber,
        specialization: optionalFields.specialization
      });
      await newTherapist.save();
    }

    return NextResponse.json(
      { message: "User registered successfully!" }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message }, 
      { status: 500 }
    );
  }
}