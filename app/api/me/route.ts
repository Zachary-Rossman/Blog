import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

// ======================================================
// GET /api/me
// ======================================================
//
// This route returns the currently authenticated user.
//
// It is the "source of truth" for authentication state
// on the frontend.
//
// The AuthProvider calls this endpoint on page load
// to determine:
//
// → Is the user logged in?
// → If yes, who are they?
//
// ======================================================
//
// FULL AUTH FLOW CONTEXT:
//
// 1. User logs in → JWT stored in httpOnly cookie
// 2. Frontend calls /api/me
// 3. Server reads cookie
// 4. Server verifies JWT
// 5. Server fetches user from DB
// 6. Returns safe user data
//
// If ANY step fails → user is treated as logged out
// ======================================================

export async function GET() {
  // ======================================================
  // STEP 1: READ AUTH COOKIE
  // ======================================================
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  // No token = user is not authenticated
  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  // ======================================================
  // STEP 2: VERIFY JWT TOKEN
  // ======================================================
  // Ensures token was signed by our server and not tampered with
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(null, { status: 401 });
  }

  // ======================================================
  // STEP 3: CONNECT TO DATABASE
  // ======================================================
  await connectDB();

  // ======================================================
  // STEP 4: FETCH USER FROM DATABASE
  // ======================================================
  // We do NOT trust JWT alone for user data.
  // We always fetch from DB to ensure user still exists.
  const user = await User.findById(payload.userId);

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  // ======================================================
  // STEP 5: RETURN SAFE USER DATA
  // ======================================================
  // IMPORTANT:
  // Never return password or sensitive fields.
  return NextResponse.json({
    id: user._id,
    username: user.username,
    email: user.email,
  });
}