"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/me");

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    }

    checkAuth();
  }, []);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    setUser(null);
    router.push("/login");
  }

  return (
    <nav className="flex justify-between items-center px-6 py-3 border bg-cyan-200">

      {/* LEFT NAV */}
      <ul className="flex gap-4">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/posts">Posts</Link></li>

        {!user && (
          <>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </>
        )}
      </ul>

      {/* RIGHT SIDE */}
      <div>
        {user && (
          <button
            onClick={handleLogout}
            className="bg-black text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>

    </nav>
  );
}