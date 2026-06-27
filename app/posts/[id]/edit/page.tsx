"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-4">
        Edit Post
      </h1>

      <EditPostForm
        id={post._id}
        initialTitle={post.title}
        initialBody={post.body}
        initialImageUrl={post.imageUrl}
        initialCategory={post.category}
      />
    </div>
  );
}