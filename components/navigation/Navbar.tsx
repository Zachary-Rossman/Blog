"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    await refreshUser();
    router.push("/login");
  }

  return (
    <nav
      aria-label="Main navigation"
      className="flex justify-between items-center p-4 border-b"
    >
      {/* LEFT */}
      <ul className="flex gap-4" role="list">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Posts</Link></li>

        {user && (
          <li><Link href="/dashboard">Dashboard</Link></li>
        )}
      </ul>

      {/* RIGHT */}
      <ul className="flex gap-4 items-center" role="list">
        {loading ? (
          <li className="text-sm text-gray-500">Loading...</li>
        ) : user ? (
          <>
            <li
              className="text-sm text-gray-600"
              aria-label={`Logged in as ${user.username}`}
            >
              {user.username}
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="text-red-500"
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}