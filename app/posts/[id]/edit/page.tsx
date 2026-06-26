"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load post
  useEffect(() => {
    async function loadPost() {
      const res = await fetch("/api/posts");
      const data = await res.json();

      const post = data.find((p: any) => p._id === params.id);

      if (!post) return;

      setTitle(post.title);
      setCategory(post.category);

      setLoading(false);
    }

    loadPost();
  }, [params.id]);

  // Save update
  async function handleUpdate() {
    if (saving) return;

    setSaving(true);

    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          category,
        }),
      });

      if (!res.ok) {
        console.log("Update failed");
        return;
      }

      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  // Enter key support (same UX as login/create forms)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleUpdate();
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        Edit Post
      </h1>

      <input
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Title"
      />

      <input
        className="border p-2 w-full mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Category"
      />

      <button
        onClick={handleUpdate}
        disabled={saving}
        className="bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}