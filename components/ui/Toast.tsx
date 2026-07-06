"use client";

import { useEffect } from "react";

/**
 * Toast Component
 *
 * PURPOSE:
 * Lightweight global notification system for success/error messages.
 *
 * HOW IT WORKS:
 * - Receives a message + type from parent state
 * - Auto-dismisses after 3 seconds
 * - Calls onClose() to let parent remove it from UI state
 *
 * DESIGN PHILOSOPHY:
 * - This is a "dumb UI component"
 * - It does NOT manage its own global state
 * - It is fully controlled by the parent
 *
 * WHY THIS IS GOOD:
 * - Easy reuse across app
 * - No dependency on auth, API, or backend
 * - Predictable lifecycle (mount → show → auto close)
 */

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  /**
   * AUTO DISMISS LOGIC
   *
   * - Runs once when component mounts
   * - Starts a 3 second timer
   * - Calls onClose() to remove toast from parent state
   *
   * IMPORTANT:
   * Cleanup function prevents memory leaks if component unmounts early
   */
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      /**
       * ACCESSIBILITY NOTES:
       *
       * role="status" → announces updates to screen readers
       * aria-live="polite" → does NOT interrupt user flow
       * aria-atomic="true" → reads full message as one unit
       *
       * This ensures toast messages are accessible without being disruptive.
       */
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`
        fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}