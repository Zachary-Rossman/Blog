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

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();

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

  async function handleDelete(id: string) {
    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    setPosts((prev) => prev.filter((p) => p._id !== id));
  }

  if (loading || loadingPosts) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-10">

      {/* HEADER */}
      <section>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome back, {user.username}.
          Manage your posts and account from one place.
        </p>
      </section>

      {/* PROFILE CARD */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="grid gap-6 md:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Username
            </p>

            <p className="mt-1 font-semibold">
              {user.username}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="mt-1 font-semibold">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Posts Written
            </p>

            <p className="mt-1 text-3xl font-bold text-blue-600">
              {posts.length}
            </p>
          </div>

        </div>

      </section>

      {/* ACTION BAR */}
      <section className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          My Posts
        </h2>

        <button
          onClick={() => router.push("/posts/new")}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          Create Post
        </button>

      </section>

      {/* EMPTY STATE */}
      {posts.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">

          <h3 className="text-xl font-semibold">
            No posts yet
          </h3>

          <p className="mt-3 text-gray-500">
            Your published posts will appear here.
          </p>

          <button
            onClick={() => router.push("/posts/new")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
          >
            Create Your First Post
          </button>

        </div>
      ) : (
        <div className="space-y-4">

          {posts.map((post) => (
            <div
              key={post._id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div>
                  <h3 className="text-xl font-semibold">
                    {post.title}
                  </h3>

                  <p className="mt-2 text-gray-500">
                    {post.category}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      router.push(`/posts/${post._id}/edit`)
                    }
                    className="rounded-lg border px-4 py-2 transition hover:bg-gray-100"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </main>
  );
}