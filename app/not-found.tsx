import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>

      <p className="text-gray-500 mb-6">
        The page you’re looking for doesn’t exist or was removed.
      </p>

      <Link
        href="/"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </main>
  );
}