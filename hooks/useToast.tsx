"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

/**
 * Toast Component
 * ----------------
 * Lightweight notification popup system.
 *
 * Responsibilities:
 * - Display temporary feedback messages (success / error)
 * - Auto-dismiss after 3 seconds
 * - Notify parent when it should be removed via onClose()
 *
 * Why this exists:
 * - Keeps UI feedback centralized instead of scattered alerts
 * - Improves UX consistency across actions (login, create post, reactions, etc.)
 *
 * Key behavior:
 * - useEffect sets a timer on mount
 * - After 3 seconds → triggers onClose()
 * - Parent component controls visibility state
 *
 * Styling:
 * - Fixed position bottom-right
 * - Green = success
 * - Red = error
 *
 * This is a "presentation-only" component (no API calls, no state logic).
 */
export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}