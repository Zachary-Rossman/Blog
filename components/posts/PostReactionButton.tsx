"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

type PostReactionButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
};

/**
 * =========================================
 * PostReactionButton (CLIENT COMPONENT)
 * =========================================
 *
 * PURPOSE:
 * - Handles "like/unlike" behavior for a post
 * - Syncs UI state with backend (/api/reactions)
 *
 * CORE IDEA:
 * - We NEVER mutate backend state directly in UI
 * - We send a request → backend decides truth → frontend updates UI
 *
 * THIS IS A "STATE SYNC BUTTON"
 * not just a visual button
 * =========================================
 */

export default function PostReactionButton({
  postId,
  initialLiked,
  initialCount,
}: PostReactionButtonProps) {

  const router = useRouter();

  /**
   * AUTH CONTEXT
   * ----------------------------
   * user:
   * - null → not logged in
   * - object → authenticated user
   *
   * loading:
   * - prevents premature interaction before session is known
   */
  const { user, loading: authLoading } = useAuth();

  // ----------------------------
  // LOCAL UI STATE
  // ----------------------------
  // IMPORTANT CONCEPT:
  // This is "optimistic UI state"
  // It reflects server-provided values initially
  // then updates based on API response

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // TOGGLE REACTION
  // ----------------------------
  /**
   * FLOW:
   *
   * 1. Prevent spam clicks (loading guard)
   * 2. Check authentication
   *    - if not logged in → redirect
   * 3. Call API route (/api/reactions)
   * 4. Backend toggles like/unlike
   * 5. Backend returns:
   *    - liked (boolean)
   *    - count (number)
   * 6. Update UI state
   */

  async function handleReaction() {
    if (loading) return;

    // AUTH GUARD
    if (!user) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId: user.id,
          type: "like",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Reaction API error:", data.error);
        return;
      }

      // SERVER IS SOURCE OF TRUTH
      setLiked(data.liked);
      setCount(data.count);

    } catch (error) {
      console.error("Reaction failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleReaction}
      disabled={loading || authLoading}
      aria-pressed={liked}
      aria-label={
        liked
          ? "Remove like from this post"
          : "Like this post"
      }

      /**
       * UI PATTERN NOTE:
       * - Conditional styling based on state (liked)
       * - This is a "state-driven UI button"
       */
      className={`
        inline-flex items-center gap-2
        rounded-lg
        border
        px-4
        py-2
        text-sm
        font-medium
        transition
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          liked
            ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {/* LOADING STATE */}
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span aria-hidden="true">
          {liked ? "❤️" : "🤍"}
        </span>
      )}

      {/* COUNT DISPLAY */}
      <span>{count}</span>
    </button>
  );
}