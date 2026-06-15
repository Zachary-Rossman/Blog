"use client";

import { useState } from "react";

export default function CreatePostForm() {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");

    return (
        <form className="flex flex-col gap-4 max-w-md">
            <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2"
            />

            <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border p-2"
            />

            <button
            type="button"
            className="bg-black text-white p-2"
            >
                Create Post
            </button>
        </form>
    )
}