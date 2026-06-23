"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  return (
    <nav>
      <ul className="flex flex-row flex-gap gap-4 border bg-cyan-200">
        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/posts">Posts</Link>
        </li>

        <li>
          <Link href="/login">Login</Link>
        </li>

        <li>
          <Link href="/register">Register</Link>
        </li>
        
        <button onClick={handleLogout}>
          Logout
        </button>
      </ul>
    </nav>
  );
}