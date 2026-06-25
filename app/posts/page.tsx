import Link from "next/link";
import PostList from "@/components/posts/PostList";

export default async function PostsPage() {
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

        <Link
          href="/posts/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + New Post
        </Link>
      </div>

      {/* Feed */}
      <PostList posts={posts} />
    </main>
  );
}