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

  // ======================================================
  // 🔐 AUTH GUARD (CLIENT-SIDE PROTECTION)
  // ======================================================
  // This ensures:
  // - If auth is still loading → wait
  // - If user is NOT logged in → redirect to login page
  //
  // Important:
  // This is NOT secure by itself.
  // Real security still comes from API routes (server-side JWT checks).
  // This is only for UX protection (prevents flashing dashboard).
  // ======================================================
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // ======================================================
  // 📦 FETCH USER POSTS
  // ======================================================
  // Flow:
  // 1. Call /api/posts (gets ALL posts)
  // 2. Filter only posts belonging to current user
  // 3. Store in local state
  //
  // Note:
  // Filtering happens client-side here.
  // A more scalable version would be a dedicated API endpoint:
  // /api/posts/mine
  // ======================================================
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

    if (user) fetchPosts();
  }, [user]);

  // ======================================================
  // 🗑 DELETE POST HANDLER
  // ======================================================
  // Flow:
  // 1. Ask user for confirmation (native confirm dialog)
  // 2. Call DELETE /api/posts/:id
  // 3. Optimistically remove post from UI
  //
  // Important:
  // Backend enforces:
  // - JWT authentication
  // - Ownership check (authorId === userId)
  // ======================================================
  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    setPosts((prev) => prev.filter((p) => p._id !== id));
  }

  // ======================================================
  // ⏳ LOADING STATE (AUTH OR DATA FETCHING)
  // ======================================================
  if (loading || loadingPosts) {
    return (
      <main
        className="max-w-6xl mx-auto px-6 py-12"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="text-gray-500">Loading dashboard...</p>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12 space-y-10"
      aria-labelledby="dashboard-title"
    >
      {/* ======================================================
          HEADER SECTION
          ====================================================== */}
      <section className="space-y-2">
        <h1
          id="dashboard-title"
          className="text-4xl font-bold tracking-tight"
        >
          Dashboard
        </h1>

        <p className="text-gray-500">
          Welcome back{" "}
          <span className="font-medium text-gray-700">
            {user.username}
          </span>
          . Manage your posts and account from one place.
        </p>
      </section>

      {/* ======================================================
          PROFILE SUMMARY CARD
          ======================================================
          Displays:
          - Username
          - Email
          - Total posts created
          ====================================================== */}
      <section
        className="rounded-2xl border bg-white p-6 shadow-sm"
        aria-label="User profile summary"
      >
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="mt-1 font-semibold">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1 font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Posts Written</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              {posts.length}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          ACTION BAR
          ======================================================
          Primary action: Create new post
          ====================================================== */}
      <section className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Posts</h2>

        <button
          onClick={() => router.push("/posts/new")}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Create a new post"
        >
          Create Post
        </button>
      </section>

      {/* ======================================================
          EMPTY STATE
          ======================================================
          Shows when user has no posts
          ====================================================== */}
      {posts.length === 0 ? (
        <section
          className="rounded-2xl border bg-white p-12 text-center shadow-sm"
          aria-label="No posts state"
        >
          <h3 className="text-xl font-semibold">No posts yet</h3>

          <p className="mt-3 text-gray-500">
            Your published posts will appear here.
          </p>

          <button
            onClick={() => router.push("/posts/new")}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create Your First Post
          </button>
        </section>
      ) : (
        // ======================================================
        // POSTS LIST
        // ======================================================
        <section className="space-y-4" aria-label="User posts list">
          {posts.map((post) => (
            <article
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

                {/* ACTION BUTTONS */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      router.push(`/posts/${post._id}/edit`)
                    }
                    className="rounded-lg border px-4 py-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    aria-label={`Edit post titled ${post.title}`}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Delete post titled ${post.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}