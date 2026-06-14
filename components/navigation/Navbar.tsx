import Link from "next/link";

export default function Navbar() {
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
      </ul>
    </nav>
  );
}