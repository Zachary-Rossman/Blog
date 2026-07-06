"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * =========================================
 * EDIT POST FORM PROPS
 * =========================================
 *
 * This defines the data required to pre-fill
 * the edit form.
 *
 * IMPORTANT:
 * These are "initial values" coming from the server.
 * They are NOT live state.
 */
type EditPostFormProps = {
  id: string;
  initialTitle: string;
  initialBody: string;
  initialCategory: string;
  initialImageUrl: string;
};

export default function EditPostForm({
  id,
  initialTitle,
  initialBody,
  initialCategory,
  initialImageUrl,
}: EditPostFormProps) {

  const router = useRouter();

  /**
   * =========================================
   * LOCAL FORM STATE
   * =========================================
   *
   * We convert initial props into state so the user
   * can edit freely without mutating props directly.
   */
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [category, setCategory] = useState(initialCategory);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  /**
   * UI STATE
   * -----------------------------------------
   * saving  -> prevents duplicate submissions
   * error   -> stores validation / API errors
   */
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * =========================================
   * HANDLE UPDATE (MAIN SUBMISSION LOGIC)
   * =========================================
   *
   * Flow:
   * 1. Prevent duplicate submissions
   * 2. Clear previous errors
   * 3. Validate input fields
   * 4. Send PUT request to API
   * 5. Handle success or failure
   * 6. Redirect back to post page
   */
  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    if (saving) return;

    setError("");

    // =========================
    // VALIDATION LAYER
    // =========================
    // Keeps invalid data from ever hitting API
    // and improves UX immediately in UI.

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

    setSaving(true);

    try {
      // =========================
      // API UPDATE REQUEST
      // =========================
      // Sends updated post data to backend
      // using RESTful PUT method.
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          category,
          imageUrl,
        }),
      });

      const data = await res.json();

      // =========================
      // ERROR HANDLING
      // =========================
      // Backend-controlled errors (validation, auth, etc.)
      if (!res.ok) {
        setError(data?.error || "Failed to update post");
        return;
      }

      // =========================
      // SUCCESS FLOW
      // =========================
      // Redirect user back to post page after update
      router.push(`/posts/${id}`);

    } catch (err) {
      // =========================
      // NETWORK ERROR HANDLING
      // =========================
      // Covers:
      // - no internet
      // - server crash
      // - fetch failure
      setError("Network error. Please try again.");

    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-5">

      {/* =========================================
          ERROR DISPLAY
      =========================================
          Accessible error container tied to inputs
          via aria-describedby.
      */}
      {error && (
        <div
          id="form-error"
          className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-red-700 text-sm"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* =========================================
          TITLE INPUT
      =========================================
          Controlled input bound to React state.
      */}
      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>

        <input
          id="title"
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          aria-invalid={!!error}
          aria-describedby={error ? "form-error" : undefined}
        />
      </div>

      {/* =========================================
          CATEGORY SELECT
      =========================================
          Controlled dropdown tied to state.
      */}
      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={saving}
          aria-invalid={!!error}
          aria-describedby={error ? "form-error" : undefined}
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

      {/* =========================================
          IMAGE URL INPUT
      =========================================
          Optional field used for preview images.
      */}
      <div className="space-y-1">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL
        </label>

        <input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          disabled={saving}
        />
      </div>

      {/* =========================================
          BODY TEXTAREA
      =========================================
          Main content editor for blog post body.
      */}
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
          disabled={saving}
          aria-invalid={!!error}
          aria-describedby={error ? "form-error" : undefined}
        />
      </div>

      {/* =========================================
          SUBMIT BUTTON
      =========================================
          Reflects loading state during API call.
      */}
      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}