import { cookies } from "next/headers";
import Link from "next/link";
import PostList from "@/components/posts/PostList";
import { verifyToken } from "@/lib/auth";

export default async function PostsPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  const isLoggedIn = !!(
    token && verifyToken(token)
  );

  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  const posts = await res.json();

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-gray-500">
            Browse the latest posts from the community
          </p>
        </div>

        {isLoggedIn && (
          <Link
            href="/posts/new"
            className="bg-black text-white px-4 py-2 rounded-2"
          >
            + New Post
          </Link>
        )}
      </div>

      {/* Feed */}
      <PostList posts={posts} />
    </main>
  );
}