"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [category, setCategory] = useState(initialCategory);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(e?: React.FormEvent) {
    e?.preventDefault();

    if (saving) return;

    setError("");

    // =========================
    // VALIDATION
    // =========================
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

      if (!res.ok) {
        setError(data?.error || "Failed to update post");
        return;
      }

      router.push(`/posts/${id}`);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      {/* ERROR MESSAGE */}
      {error && (
        <div
          id="form-error"
          className="border border-red-300 bg-red-50 text-red-700 p-3 rounded"
        >
          {error}
        </div>
      )}

      {/* TITLE */}
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>

        <input
          id="title"
          className="border p-2 w-full rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          aria-describedby={error ? "form-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      {/* CATEGORY */}
      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="text-sm font-medium">
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={saving}
          aria-describedby={error ? "form-error" : undefined}
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

      {/* IMAGE */}
      <div className="flex flex-col gap-1">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL
        </label>

        <input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={saving}
        />
      </div>

      {/* BODY */}
      <div className="flex flex-col gap-1">
        <label htmlFor="body" className="text-sm font-medium">
          Body
        </label>

        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          className="border p-2 w-full rounded"
          disabled={saving}
          aria-describedby={error ? "form-error" : undefined}
          aria-invalid={!!error}
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={saving}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}