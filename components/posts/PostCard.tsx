"use client";

import Link from "next/link";

type Post = {
  _id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  imageUrl?: string;
};

export default function PostCard({
  post,
  loading = false,
}: {
  post?: Post;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div
        className="border rounded-lg p-4 animate-pulse space-y-3"
        aria-hidden="true"
      >
        <div className="h-5 bg-gray-200 w-3/4 rounded" />
        <div className="h-3 bg-gray-200 w-1/2 rounded" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <article>
      <Link
        href={`/posts/${post._id}`}
        className="block border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-black"
        aria-label={`Read post: ${post.title}`}
      >

        {/* IMAGE */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-40 object-cover rounded mb-3"
            loading="lazy"
          />
        )}

        {/* TITLE */}
        <h2 className="text-lg font-semibold mb-2">
          {post.title}
        </h2>

        {/* META */}
        <p className="text-sm text-gray-500">
          Posted by{" "}
          <span className="font-medium text-gray-700">
            {post.author}
          </span>{" "}
          · {post.category}
        </p>

      </Link>
    </article>
  );
}