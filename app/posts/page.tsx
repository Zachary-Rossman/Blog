import { cookies } from "next/headers";
import { getPosts } from "@/lib/posts";
import Link from "next/link";
import PostList from "@/components/posts/PostList";
import { verifyToken } from "@/lib/auth";

export default async function PostsPage() {
  /**
   * =====================================================
   * SERVER-SIDE COOKIE ACCESS
   * =====================================================
   *
   * This runs on the server during render.
   * Used to determine auth state before UI is generated.
   */
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  /**
   * =====================================================
   * AUTH STATE CHECK (LIGHTWEIGHT)
   * =====================================================
   *
   * isLoggedIn:
   * - derived from cookie + JWT verification
   *
   * IMPORTANT:
   * - This does NOT block the page
   * - It only affects UI (conditional rendering)
   *
   * This is a "soft guard" compared to redirect-based protection.
   */
  const isLoggedIn = !!(token && verifyToken(token));

  /**
   * =====================================================
   * POSTS FETCH (SERVER RENDERED)
   * =====================================================
   *
   * cache: "no-store"
   * - ensures fresh feed every request
   *
   * DESIGN DECISION:
   * - fetching ALL posts
   * - passing to PostList for rendering
   *
   * NOTE:
   * This is a simple architecture choice for learning purposes.
   * In production, you may want:
   * - pagination
   * - filtering
   * - server-side query params
   */
  const res = await fetch("/api/posts", {
    cache: "no-store",
  });

  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* =====================================================
            PAGE HEADER SECTION
        ===================================================== */}
        <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

          {/* TITLE BLOCK */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Community Posts
            </h1>

            <p className="text-gray-600">
              Discover tutorials, insights, and ideas from developers around the world.
            </p>
          </div>

          {/* =====================================================
              CONDITIONAL CTA (AUTH-BASED UI)
          ===================================================== */}
          {isLoggedIn && (
            <Link
              href="/posts/new"
              className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-white font-medium transition hover:bg-gray-800"
            >
              + New Post
            </Link>
          )}
        </header>

        {/* =====================================================
            POSTS FEED CONTAINER
        ===================================================== */}
        <section
          className="bg-white border rounded-2xl shadow-sm p-6"
          aria-label="Posts feed"
        >
          <PostList posts={posts} />
        </section>

      </div>

    </main>
  );
}