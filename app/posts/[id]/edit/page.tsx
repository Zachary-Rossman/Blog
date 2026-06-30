"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import EditPostForm from "@/components/posts/EditPostForm";

type Post = {
  _id: string;
  title: string;
  imageUrl: string;
  body: string;
  category: string;
};

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();

        const found = data.find(
          (p: Post) => p._id === params.id
        );

        setPost(found || null);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [params.id]);

  // ⏳ LOADING STATE
  if (loading) {
    return (
      <main
        className="max-w-2xl mx-auto px-6 py-12"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="text-gray-500">Loading editor...</p>
      </main>
    );
  }

  // ❌ NOT FOUND STATE
  if (!post) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">Post not found</h1>

        <p className="text-gray-500">
          The post you’re trying to edit doesn’t exist or was removed.
        </p>

        <button
          onClick={() => router.push("/posts")}
          className="rounded-lg bg-black px-5 py-2 text-white"
        >
          Back to Posts
        </button>
      </main>
    );
  }

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-12"
      aria-labelledby="edit-post-title"
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="space-y-2 text-center">
          <h1
            id="edit-post-title"
            className="text-4xl font-bold tracking-tight text-gray-900"
          >
            Edit Post
          </h1>

          <p className="text-gray-600">
            Update your content, improve clarity, or fix details.
          </p>
        </header>

        {/* FORM CARD */}
        <section
          className="bg-white border rounded-2xl shadow-sm p-6"
          aria-label="Edit post form"
        >
          <EditPostForm
            id={post._id}
            initialTitle={post.title}
            initialBody={post.body}
            initialImageUrl={post.imageUrl}
            initialCategory={post.category}
          />
        </section>

      </div>
    </main>
  );
}