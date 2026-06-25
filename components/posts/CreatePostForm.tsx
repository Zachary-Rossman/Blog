"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreatePostInput } from "@/types/post";

export default function CreatePostForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    setLoading(true);

    const newPost: CreatePostInput = {
      title,
      category,
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

      console.log(data);

      // redirect to posts feed after creation
      router.push("/posts");

    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form
      className="flex flex-col gap-4 max-w-md"
      onKeyDown={handleKeyDown}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="border p-2"
        disabled={loading}
      />

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border p-2"
        disabled={loading}
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white p-2 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}