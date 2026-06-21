import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get("auth_token")?.value;

    const isLoggedIn = !!authToken;

    const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}