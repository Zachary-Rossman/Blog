import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // 1. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. Compare password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Create JWT
    const token = signToken(user._id.toString());

    // 4. Create response
    const response = NextResponse.json({
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

    // 5. Set cookie (THIS is the key part)
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return response;

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}