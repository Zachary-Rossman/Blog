"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    user,
    loading,
    refreshUser,
  } = useAuth();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    await refreshUser();

    router.push("/login");
  }

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
        {/* LEFT SIDE */}
        <div className="flex items-center gap-10">

          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            Blog
          </Link>

          {/* NAV LINKS */}
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

        {/* RIGHT SIDE */}
        <div>

          {loading ? (
            <p className="text-sm text-gray-500">
              Loading...
            </p>
          ) : user ? (
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