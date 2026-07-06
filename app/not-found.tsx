import Link from "next/link";

/**
 * =====================================================
 * GLOBAL 404 PAGE (NOT FOUND ROUTE)
 * =====================================================
 *
 * PURPOSE:
 * - Automatically rendered when a route does not exist
 * - Also triggered manually via `notFound()` in server components
 *
 * BEHAVIOR:
 * - Replaces default browser 404 page
 * - Fully controlled UI inside Next.js App Router
 */
export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-20 text-center">

      {/* ERROR CODE */}
      <h1 className="text-4xl font-bold mb-4">
        404
      </h1>

      {/* MESSAGE */}
      <p className="text-gray-500 mb-6">
        The page you’re looking for doesn’t exist or was removed.
      </p>

      {/* NAVIGATION BACK */}
      <Link
        href="/"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>

    </main>
  );
}