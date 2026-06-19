"use client";

import { useState } from "react";
import type { CreatePostInput } from "@/types/post";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ category, setCategory ] = useState("");

  async function handleSubmit() {
  const newPost: CreatePostInput = {
    title,
    author,
    category
  };

  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPost),
  });

  const data = await response.json();

  console.log(data);
}

  return (
    <form className="flex flex-col gap-4 max-w-md">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="border p-2"
      />

      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        className="border p-2"
      />

      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="border p-2"
      />

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-black text-white p-2"
      >
        Create Post
      </button>
    </form>
  );
}