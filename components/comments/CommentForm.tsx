"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * ============================================================
 * COMMENT FORM
 * ============================================================
 *
 * This component allows an authenticated user to submit a
 * comment on a blog post.
 *
 * Responsibilities:
 *
 * • Manage the form state.
 * • Validate user input.
 * • Send the comment to the API.
 * • Display loading and error states.
 * • Refresh server data after successful creation.
 *
 * The actual database work happens inside the API route.
 * This component only gathers user input and sends it.
 */

type CommentFormProps = {
  postId: string;
  onCommentAdded?: () => void;
};

export default function CommentForm({
  postId,
  onCommentAdded,
}: CommentFormProps) {

  /*
   * ==========================================================
   * ROUTER
   * ==========================================================
   *
   * router.refresh()
   *
   * Re-runs server components and refreshes server-fetched data
   * without requiring a full browser reload.
   *
   * This allows newly-created comments to appear immediately.
   */

  const router = useRouter();


  /*
   * ==========================================================
   * COMPONENT STATE
   * ==========================================================
   *
   * content
   *   Stores the user's comment text.
   *
   * imageUrl
   *   Optional image attached to the comment.
   *
   * loading
   *   Prevents duplicate submissions.
   *
   * error
   *   Displays validation or API errors.
   */

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  /**
   * ==========================================================
   * HANDLE SUBMIT
   * ==========================================================
   *
   * Workflow:
   *
   * 1. Prevent normal form submission.
   * 2. Prevent duplicate requests.
   * 3. Validate comment content.
   * 4. Send comment data to API.
   * 5. Clear form after success.
   * 6. Refresh server components.
   */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setError("");


    // Validate comment content before sending request.
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
          content,
          imageUrl: imageUrl || undefined,
        }),
      });


      const data = await res.json();


      // Handle API errors.
      if (!res.ok) {
        setError(data?.error || "Failed to post comment");
        return;
      }


      /*
       * Reset form after successful creation.
       */
      setContent("");
      setImageUrl("");


      /*
       * Notify parent component if it needs to react.
       */
      onCommentAdded?.();


      /*
       * Refresh server components.
       *
       * This causes the post page to:
       *
       * 1. Re-run its server fetch.
       * 2. Get the newest comments.
       * 3. Render the updated comment list.
       *
       * No manual browser refresh required.
       */
      router.refresh();


    } catch {
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

      {/* ERROR MESSAGE */}
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


      {/* COMMENT FIELD */}
      <div className="space-y-1">

        <label
          htmlFor="comment"
          className="text-sm font-medium text-gray-700"
        >
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


      {/* OPTIONAL IMAGE */}
      <div className="space-y-1">

        <label
          htmlFor="imageUrl"
          className="text-sm font-medium text-gray-700"
        >
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


      {/* SUBMIT BUTTON */}
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