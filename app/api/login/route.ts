import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    // ======================================================
    // STEP 1: CONNECT TO DATABASE
    // ======================================================
    // Ensures MongoDB connection is ready before queries
    await connectDB();

    // ======================================================
    // STEP 2: EXTRACT LOGIN CREDENTIALS
    // ======================================================
    // Incoming payload from login form
    const { email, password } = await request.json();

    // ======================================================
    // STEP 3: FIND USER BY EMAIL
    // ======================================================
    // We use email as the primary login identifier
    const user = await User.findOne({ email });

    // If no user exists → reject login
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ======================================================
    // STEP 4: VERIFY PASSWORD
    // ======================================================
    // bcrypt compares plain password vs hashed password in DB
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ======================================================
    // STEP 5: CREATE JWT TOKEN
    // ======================================================
    // Token encodes userId securely for authentication
    const token = signToken(user._id.toString());

    // ======================================================
    // STEP 6: BUILD RESPONSE
    // ======================================================
    // We return safe user data (NO password ever sent)
    const response = NextResponse.json({
      message: "Login Successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });

    // ======================================================
    // STEP 7: SET HTTP-ONLY AUTH COOKIE
    // ======================================================
    // This is what keeps the user logged in across requests
    //
    // IMPORTANT NOTES:
    // - httpOnly: prevents JS access (security protection)
    // - secure: false (dev mode; should be true in production)
    // - sameSite: strict prevents CSRF-style attacks
    // - maxAge: 7 days login session
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error) {
    // ======================================================
    // ERROR HANDLING (SERVER-SIDE)
    // ======================================================
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}