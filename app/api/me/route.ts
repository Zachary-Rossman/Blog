import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies(); // 👈 FIX HERE

  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(null, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json({
    userId: payload.userId,
  });
}