"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /**
   * =====================================================
   * ERROR BOUNDARY HOOK
   * =====================================================
   *
   * Next.js App Router error.tsx acts as a:
   * - client-side error boundary
   * - catches runtime rendering errors
   *
   * PREVIOUS DEV BEHAVIOR:
   * - console.error("Route error:", error)
   *
   * CLEANUP DECISION:
   * - removed console logging (frontend debug noise)
   * - keeping UI only behavior
   */

  useEffect(() => {
    // (DEV LOG REMOVED)
    // Previously:
    // console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      
      {/* =====================================================
          ERROR STATE UI
      ===================================================== */}
      <h2 className="text-2xl font-bold mb-2">
        Something went wrong
      </h2>

      <p className="text-gray-500 mb-6">
        We ran into an unexpected error. Please try again.
      </p>

      {/* =====================================================
          RECOVERY ACTION
      ===================================================== */}
      <button
        onClick={() => reset()}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Try again
      </button>
    </main>
  );
}