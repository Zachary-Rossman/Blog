"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    await refreshUser(); // clears auth state in UI
    router.push("/login");
  }

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      {/* LEFT SIDE LINKS */}
      <ul className="flex gap-4">
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/posts">Posts</Link>
        </li>

        {user && (
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        )}
      </ul>

      {/* RIGHT SIDE AUTH */}
      <ul className="flex gap-4 items-center">
        {loading ? null : (
          <>
            {user ? (
              <>
                <li className="text-sm text-gray-600">
                  {user.username}
                </li>

                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-500"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login">Login</Link>
                </li>

                <li>
                  <Link href="/register">Register</Link>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}