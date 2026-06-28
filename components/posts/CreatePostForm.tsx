"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreatePostInput } from "@/types/post";

export default function CreatePostForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (loading) return;

    // reset previous error
    setError("");

    // =========================
    // 1. CLIENT VALIDATION
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

    setLoading(true);

    const newPost: CreatePostInput = {
      title,
      body,
      category,
      imageUrl: imageUrl || undefined,
    };

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.error || "Failed to create post");
        return;
      }

      router.push("/posts");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4 max-w-md"
      onSubmit={handleSubmit}
    >
      {/* ERROR DISPLAY */}
      {error && (
        <div className="border border-red-300 bg-red-50 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="border p-2"
        disabled={loading}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        disabled={loading}
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

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (optional)"
        className="border p-2 rounded w-full mb-3"
        disabled={loading}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What would you like to share?"
        rows={10}
        className="border p-2"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}