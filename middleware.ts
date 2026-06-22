import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token || !verifyToken(token)) {

    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    console.log("TOKEN:", token);

    console.log("VERIFY:", verifyToken(token));

    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};