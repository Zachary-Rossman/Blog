"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

/**
 * ============================================================
 * NAVBAR
 * ============================================================
 *
 * The navigation bar is displayed on every page of the application.
 *
 * Responsibilities:
 *
 * • Display navigation links.
 * • Highlight the current page.
 * • Show different navigation depending on whether
 *   the user is logged in.
 * • Allow the user to log out.
 *
 * Because this component uses React hooks
 * (usePathname, useRouter, useAuth),
 * it must be a Client Component.
 */

export default function Navbar() {
  /**
   * ============================================================
   * NEXT.JS NAVIGATION
   * ============================================================
   *
   * usePathname()
   * Gives us the current URL so we can highlight
   * the active navigation link.
   *
   * useRouter()
   * Allows programmatic navigation after logout.
   */
  const pathname = usePathname();
  const router = useRouter();

  /**
   * ============================================================
   * AUTHENTICATION STATE
   * ============================================================
   *
   * Provided by AuthProvider.
   *
   * user
   * The currently logged in user, or null.
   *
   * loading
   * Indicates whether authentication is still being checked.
   *
   * refreshUser()
   * Re-fetches the current user after login or logout so the
   * UI immediately reflects the new authentication state.
   */
  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  /**
   * ============================================================
   * HANDLE LOGOUT
   * ============================================================
   *
   * Flow:
   *
   * 1. Call the logout API.
   * 2. Remove the current user from AuthProvider.
   * 3. Redirect to the login page.
   *
   * The API clears the authentication cookie.
   * refreshUser() updates the React application without
   * requiring a full page refresh.
   */
  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    await refreshUser();

    router.push("/login");
  }

  /**
   * ============================================================
   * ACTIVE NAVIGATION STYLING
   * ============================================================
   *
   * Every navigation link passes its route into this helper.
   *
   * If the current pathname matches,
   * the link receives the "active" styling.
   *
   * Otherwise it receives the default styling.
   */
  function navLinkClasses(path: string) {
    const active = pathname === path;

    return `
      px-3
      py-2
      rounded-lg
      transition-colors
      ${
        active
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }
    `;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4"
      >
        {/* ========================================================
            LEFT SIDE
        ===========================================================
            Contains:
            • Logo
            • Main navigation links
        */}
        <div className="flex items-center gap-10">

          {/* ====================================================
              APPLICATION LOGO
          ===================================================== */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Blog
          </Link>

          {/* ====================================================
              PRIMARY NAVIGATION
          ===================================================== */}
          <ul
            role="list"
            className="flex items-center gap-2"
          >
            <li>
              <Link
                href="/"
                className={navLinkClasses("/")}
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/posts"
                className={navLinkClasses("/posts")}
              >
                Posts
              </Link>
            </li>

            {/* --------------------------------------------------
                Dashboard is only visible for authenticated users.
            --------------------------------------------------- */}
            {user && (
              <li>
                <Link
                  href="/dashboard"
                  className={navLinkClasses("/dashboard")}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

        </div>

        {/* ========================================================
            RIGHT SIDE
        ===========================================================
            Displays different UI depending on authentication.
        */}
        <div>

          {/* ----------------------------------------------------
              Authentication is still loading.
          ----------------------------------------------------- */}
          {loading ? (
            <p className="text-sm text-gray-500">
              Loading...
            </p>

          ) : user ? (

            /* --------------------------------------------------
               Logged-in navigation
            --------------------------------------------------- */
            <div className="flex items-center gap-4">

              <span
                className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium"
                aria-label={`Logged in as ${user.username}`}
              >
                {user.username}
              </span>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-red-300 px-4 py-2 text-red-600 transition hover:bg-red-50"
              >
                Logout
              </button>

            </div>

          ) : (

            /* --------------------------------------------------
               Guest navigation
            --------------------------------------------------- */
            <div className="flex items-center gap-3">

              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-gray-600 transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
              >
                Get Started
              </Link>

            </div>
          )}

        </div>
      </nav>
    </header>
  );
}