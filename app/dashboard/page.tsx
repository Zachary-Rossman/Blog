"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type Post = {
  _id: string;
  title: string;
  category: string;
  publishedDate: string;
  authorId: string;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // 🔐 AUTH GUARD
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // 📦 FETCH POSTS
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();

        // 🧠 safety check + filter ONLY user's posts
        const userPosts = Array.isArray(data)
          ? data.filter((post: Post) => post.authorId === user?.id)
          : [];

        setPosts(userPosts);
      } finally {
        setLoadingPosts(false);
      }
    }

    if (user) {
      fetchPosts();
    }
  }, [user]);

  // 🗑 DELETE POST
  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    setPosts((prev) => prev.filter((p) => p._id !== id));
  }

  // ⏳ LOADING STATE
  if (loading || loadingPosts) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* PROFILE */}
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="border p-4 rounded mb-8">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/posts/new")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Post
        </button>
      </div>
      
      {/* POSTS */}
      <h2 className="text-2xl font-semibold mb-4">
        My Posts
      </h2>
      
      {posts.length === 0 ? (
        <div className="border rounded-lg p-8 text-center space-y-4">
          <h3 className="text-lg font-semibold">
            No posts yet
          </h3>
          
          <p className="text-gray-500">
            You haven’t created any posts. Start by writing your first one.
          </p>
          
          <button
          onClick={() => router.push("/posts/new")}
          className="bg-black text-white px-4 py-2 rounded"
          >
            Create Your First Post
          </button>
          
          </div>
        
      ) : (
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div
          key={post._id}
          className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {post.title}
              </h3>
              
              <p className="text-sm text-gray-500">
                {post.category}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
              onClick={() => 
                router.push(`/posts/${post._id}/edit`)
              }
              className="px-3 py-1 border rounded"
              >
                Edit
              </button>
              
              <button
              onClick={() => handleDelete(post._id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  );
}