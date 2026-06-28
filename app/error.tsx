"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h2 className="text-2xl font-bold mb-2">
        Something went wrong
      </h2>

      <p className="text-gray-500 mb-6">
        We ran into an unexpected error. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Try again
      </button>
    </main>
  );
}