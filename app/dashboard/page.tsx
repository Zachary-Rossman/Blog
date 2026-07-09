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
  const [error, setError] = useState("");

  // ======================================================
  // AUTH GUARD
  // ======================================================
  //
  // This protects the user experience.
  //
  // Important:
  // This is NOT the actual security layer.
  // API routes still verify JWT cookies on the server.
  //
  // This only prevents users from seeing dashboard UI
  // before authentication finishes loading.
  // ======================================================

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, loading, router]);


  // ======================================================
  // FETCH CURRENT USER POSTS
  // ======================================================
  //
  // IMPORTANT ARCHITECTURE CHANGE:
  //
  // Before:
  // - Dashboard fetched ALL posts
  // - Filtered them inside the browser
  //
  // Problem:
  // - Downloads unnecessary data
  // - Not scalable
  //
  // Now:
  // - Calls /api/posts/mine
  // - Backend already knows the logged-in user
  // - Returns only owned posts
  //
  // This keeps ownership logic on the server.
  // ======================================================

  useEffect(() => {
    async function fetchPosts() {
      try {
        setError("");

        const res = await fetch("/api/posts/mine");

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load posts"
          );
        }

        setPosts(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {
        console.error(
          "Dashboard post loading error:",
          error
        );

        setError(
          "Unable to load your posts. Please try again."
        );

      } finally {
        setLoadingPosts(false);
      }
    }

    if (user) {
      fetchPosts();
    }

  }, [user]);


  // ======================================================
  // DELETE POST
  // ======================================================
  //
  // Flow:
  //
  // 1. Confirm deletion.
  // 2. Send DELETE request.
  // 3. Remove deleted post from UI.
  //
  // Backend still verifies:
  // - Authentication
  // - Ownership
  // ======================================================

  async function handleDelete(id: string) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;


    const res = await fetch(
      `/api/posts/${id}`,
      {
        method: "DELETE",
      }
    );


    if (!res.ok) {
      setError(
        "Failed to delete post."
      );
      return;
    }


    setPosts((previous) =>
      previous.filter(
        (post) => post._id !== id
      )
    );
  }


  // ======================================================
  // LOADING STATE
  // ======================================================

  if (loading || loadingPosts) {
    return (
      <main
        className="max-w-6xl mx-auto px-6 py-12"
        aria-busy="true"
        aria-live="polite"
      >
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </main>
    );
  }


  if (!user) return null;


  return (
    <main
      className="max-w-6xl mx-auto px-6 py-12 space-y-10"
      aria-labelledby="dashboard-title"
    >

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


      {error && (
        <section
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </section>
      )}


      <section
        className="rounded-2xl border bg-white p-6 shadow-sm"
        aria-label="User profile summary"
      >

        <div className="grid gap-6 md:grid-cols-3">

          <div>
            <p className="text-sm text-gray-500">
              Username
            </p>

            <p className="font-semibold">
              {user.username}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="font-semibold">
              {user.email}
            </p>
          </div>


          <div>
            <p className="text-sm text-gray-500">
              Posts Written
            </p>

            <p className="text-3xl font-bold text-blue-600">
              {posts.length}
            </p>
          </div>

        </div>

      </section>


      <section className="flex justify-between items-center">

        <h2 className="text-2xl font-bold">
          My Posts
        </h2>


        <button
          onClick={() =>
            router.push("/posts/new")
          }
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Create Post
        </button>

      </section>


      {posts.length === 0 ? (

        <section
          className="rounded-2xl border bg-white p-12 text-center shadow-sm"
        >

          <h3 className="text-xl font-semibold">
            No posts yet
          </h3>


          <p className="mt-3 text-gray-500">
            Your published posts will appear here.
          </p>


          <button
            onClick={() =>
              router.push("/posts/new")
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Create Your First Post
          </button>

        </section>

      ) : (

        <section
          className="space-y-4"
          aria-label="User posts list"
        >

          {posts.map((post) => (

            <article
              key={post._id}
              className="rounded-2xl border bg-white p-6 shadow-sm"
            >

              <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center">

                <div>

                  <h3 className="text-xl font-semibold">
                    {post.title}
                  </h3>


                  <p className="text-gray-500 mt-2">
                    {post.category}
                  </p>

                </div>


                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      router.push(
                        `/posts/${post._id}/edit`
                      )
                    }
                    className="rounded-lg border px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(post._id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
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