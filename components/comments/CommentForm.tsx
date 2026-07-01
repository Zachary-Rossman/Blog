"use client";

import { useState } from "react";

type CommentFormProps = {
  postId: string;
  userId: string;
  onCommentAdded?: () => void;
};

export default function CommentForm({
  postId,
  userId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;
    setError("");

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          userId,
          content,
          imageUrl: imageUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to post comment");
        return;
      }

      setContent("");
      setImageUrl("");

      onCommentAdded?.();
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
      aria-describedby={error ? "comment-error" : undefined}
    >
      {/* ERROR */}
      {error && (
        <div
          id="comment-error"
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* COMMENT */}
      <div className="space-y-1">
        <label htmlFor="comment" className="text-sm font-medium text-gray-700">
          Comment
        </label>

        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          disabled={loading}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your comment..."
        />
      </div>

      {/* IMAGE URL */}
      <div className="space-y-1">
        <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
          Image URL (optional)
        </label>

        <input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://..."
        />
      </div>

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
}