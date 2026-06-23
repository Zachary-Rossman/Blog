import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(null, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(payload.userId);

  if (!user) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({
    id: user._id,
    username: user.username,
    email: user.email,
  });
}