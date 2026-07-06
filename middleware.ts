import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * =====================================================
 * MIDDLEWARE (AUTH PROTECTION LAYER)
 * =====================================================
 *
 * PURPOSE:
 * - Protects private routes (currently /dashboard)
 * - Runs BEFORE route handler/page is executed
 *
 * FLOW:
 * 1. Read auth cookie
 * 2. Verify JWT token
 * 3. If invalid → redirect to login
 * 4. If valid → allow request to continue
 *
 * NOTE:
 * - Runs on Edge Runtime (NOT Node.js server context)
 * - Should remain lightweight and fast
 */
export const runtime = "nodejs";

export function middleware(req: NextRequest) {
  // =====================================================
  // AUTH TOKEN FROM COOKIE
  // =====================================================
  const token = req.cookies.get("auth_token")?.value;

  // =====================================================
  // AUTH VALIDATION
  // =====================================================
  const isValid = token ? verifyToken(token) : null;

  if (!token || !isValid) {
    /**
     * SECURITY BEHAVIOR:
     * - Invalid or missing token → redirect to login
     * - Prevents access to protected routes
     */

    return NextResponse.redirect(new URL("/login", req.url));
  }

  // =====================================================
  // ALLOW REQUEST THROUGH
  // =====================================================
  return NextResponse.next();
}

/**
 * =====================================================
 * ROUTE PROTECTION CONFIG
 * =====================================================
 *
 * Only applies middleware to:
 * - /dashboard
 *
 * (You can extend this later to protect /posts/new, etc.)
 */
export const config = {
  matcher: ["/dashboard"],
};