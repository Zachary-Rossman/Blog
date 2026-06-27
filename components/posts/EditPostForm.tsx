"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditPostFormProps = {
  id: string;
  initialTitle: string;
  initialBody: string;
  initialCategory: string;
};

export default function EditPostForm({
  id,
  initialTitle,
  initialBody,
  initialCategory,
}: EditPostFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [category, setCategory] = useState(initialCategory);

  const [saving, setSaving] = useState(false);

  async function handleUpdate() {
    if (saving) return;

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
        }),
      });

      if (!res.ok) {
        console.log("Update failed");
        return;
      }

      // redirect to post after update
      router.push(`/posts/${id}`);
    } finally {
      setSaving(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleUpdate();
    }
  }

  return (
    <div>
      {/* TITLE */}
      <input
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Title"
        disabled={saving}
      />

      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        disabled={saving}
      >
      <option 
        value="">
            Select Category
      </option>

      <option 
        value="Technology">
            Technology
      </option>

      <option 
        value="Programming">
            Programming
      </option>

      <option 
        value="Career">
            Career
      </option>

      <option 
        value="Gaming">
            Gaming
      </option>

      <option 
        value="Design">
            Design
      </option>

      <option 
        value="Business">
            Business
      </option>
      
      <option 
        value="Tutorial">
            Tutorial
      </option>
      
      </select>

      {/* BODY */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What would you like to share?"
        rows={10}
        className="border p-2 w-full mb-3"
        disabled={saving}
      />

      {/* SAVE BUTTON */}
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