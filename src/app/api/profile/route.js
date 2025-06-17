// app/api/profile/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  try {
    await dbConnect();
    
    const token = await getToken({ req });
    if (!token) {
      return new Response(JSON.stringify({ message: 'Not authenticated' }), { status: 401 });
    }

    const user = await User.findById(token.userId).select('-password');
    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Server error' }), { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const token = await getToken({ req: request });
    const data = await request.json();

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      token.userId,
      { $set: data },
      { new: true }
    ).select('-password');

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}