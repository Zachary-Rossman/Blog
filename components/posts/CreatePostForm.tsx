"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreatePostInput } from "@/types/Post";

/**
 * ============================================================
 * CREATE POST FORM
 * ============================================================
 *
 * This component allows an authenticated user to create
 * a brand new blog post.
 *
 * Workflow:
 *
 * 1. User fills out the form.
 * 2. Local validation checks required fields.
 * 3. Form sends a POST request to /api/posts.
 * 4. API creates the new post in MongoDB.
 * 5. User is redirected to the posts page.
 */

export default function CreatePostForm() {
  const router = useRouter();

  /**
   * ============================================================
   * FORM STATE
   * ============================================================
   *
   * Each input is controlled by React state.
   * This keeps the UI synchronized with the values
   * the user is currently typing.
   */
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  /**
   * UI STATE
   * ------------------------------------------------------------
   * loading
   * Prevents duplicate submissions while the request is running.
   *
   * error
   * Stores validation or API errors so they can be displayed
   * to the user.
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * ============================================================
   * HANDLE FORM SUBMISSION
   * ============================================================
   *
   * Flow:
   *
   * 1. Prevent browser refresh.
   * 2. Prevent duplicate submissions.
   * 3. Validate required fields.
   * 4. Build the request object.
   * 5. Send POST request.
   * 6. Handle success or failure.
   */
  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (loading) return;

    setError("");

    // ========================================================
    // CLIENT-SIDE VALIDATION
    // ========================================================
    // Prevent unnecessary API requests by ensuring the user
    // has completed the required fields first.

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    if (!body.trim()) {
      setError("Body is required");
      return;
    }

    setLoading(true);

    /**
     * Build the object expected by the API.
     *
     * imageUrl is optional, so an empty string is converted
     * into undefined before being sent.
     */
    const newPost: CreatePostInput = {
      title,
      body,
      category,
      imageUrl: imageUrl || undefined,
    };

    try {
      /**
       * Send the new post to the API.
       *
       * The backend is responsible for:
       * - authentication
       * - ownership
       * - database insertion
       */
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();

      /**
       * API-level errors.
       *
       * These usually come from validation or authorization
       * performed on the server.
       */
      if (!response.ok) {
        setError(data?.error || "Failed to create post");
        return;
      }

      /**
       * Successful creation.
       *
       * Redirect back to the posts page where the newly
       * created post will appear.
       */
      router.push("/posts");

    } catch {
      /**
       * Network-level errors.
       *
       * Examples:
       * - server offline
       * - internet connection lost
       * - request timeout
       */
      setError("Network error. Please try again.");

    } finally {
      /**
       * Always restore the button state,
       * regardless of success or failure.
       */
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 max-w-md"
      aria-describedby={error ? "form-error" : undefined}
    >
      {/* ========================================================
          ERROR DISPLAY
      ===========================================================
          Displays validation and API errors to the user.
      */}
      {error && (
        <div
          id="form-error"
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700"
        >
          {error}
        </div>
      )}

      {/* ========================================================
          TITLE INPUT
      ======================================================== */}
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>

        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          aria-invalid={!!error}
        />
      </div>

      {/* ========================================================
          CATEGORY SELECT
      ======================================================== */}
      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          aria-invalid={!!error}
        >
          <option value="">Select Category</option>
          <option value="Technology">Technology</option>
          <option value="Programming">Programming</option>
          <option value="Career">Career</option>
          <option value="Gaming">Gaming</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
          <option value="Tutorial">Tutorial</option>
        </select>
      </div>

      {/* ========================================================
          OPTIONAL IMAGE URL
      ======================================================== */}
      <div className="space-y-1">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL (optional)
        </label>

        <input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
        />
      </div>

      {/* ========================================================
          POST BODY
      ======================================================== */}
      <div className="space-y-1">
        <label htmlFor="body" className="text-sm font-medium">
          Body
        </label>

        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="w-full rounded-md border px-3 py-2"
          disabled={loading}
          aria-invalid={!!error}
        />
      </div>

      {/* ========================================================
          SUBMIT BUTTON
      ========================================================
          The button reflects the current submission state so
          users cannot accidentally create duplicate posts.
      */}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}