import { cookies } from "next/headers";
import Link from "next/link";
import PostList from "@/components/posts/PostList";
import { verifyToken } from "@/lib/auth";

export default async function PostsPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  const isLoggedIn = !!(token && verifyToken(token));

  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  const posts = await res.json();

  return (
    <main className="min-h-screen bg-gray-50">
      
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">

        {/* HEADER */}
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

          {/* CTA */}
          {isLoggedIn && (
            <Link
              href="/posts/new"
              className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-3 text-white font-medium transition hover:bg-gray-800"
            >
              + New Post
            </Link>
          )}
        </header>

        {/* FEED CONTAINER */}
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