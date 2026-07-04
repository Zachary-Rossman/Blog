"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

type PostReactionButtonProps = {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
};

export default function PostReactionButton({
  postId,
  initialLiked,
  initialCount,
}: PostReactionButtonProps) {

  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  
  // ----------------------------
  // Component state
  // ----------------------------
  
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // ----------------------------
  // Toggle reaction
  // ----------------------------

  async function handleReaction() {
    if (loading) return;

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
        console.error(data.error);
        return;
      }

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
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span aria-hidden="true">
          {liked ? "❤️" : "🤍"}
        </span>
      )}

      <span>{count}</span>
    </button>
  );
}