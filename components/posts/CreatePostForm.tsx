"use client";

import { useState } from "react";
import type { Post } from "@/types/post";

type Props = {
  onCreate: (post: Post) => void;
};

export default function CreatePostForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  function handleSubmit() {
    const newPost: Post = {
      id: Date.now(),
      title,
      author,
      category: "General",
      publishedDate: new Date().toISOString(),
      likes: 0,
      comments: 0,
    };

    onCreate(newPost);

    setTitle("");
    setAuthor("");
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