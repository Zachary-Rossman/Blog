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
        className="overflow-hidden rounded-2xl border bg-white shadow-sm animate-pulse"
        aria-hidden="true"
      >
        <div className="h-52 bg-gray-200" />

        <div className="space-y-4 p-6">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-5/6 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <article>
      <Link
        href={`/posts/${post._id}`}
        aria-label={`Read post: ${post.title}`}
        className="
          block
          overflow-hidden
          rounded-2xl
          border
          bg-white
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          focus:outline-none
          focus:ring-2
          focus:ring-blue-600
        "
      >
        {/* IMAGE */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            className="h-52 w-full object-cover"
          />
        )}

        <div className="space-y-4 p-6">

          {/* CATEGORY */}
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {post.category}
          </span>

          {/* TITLE */}
          <h2 className="text-2xl font-bold leading-tight text-gray-900">
            {post.title}
          </h2>

          {/* BODY PREVIEW */}
          <p className="line-clamp-3 text-gray-600">
            {post.body}
          </p>

          {/* FOOTER */}
          <div className="flex items-center justify-between pt-2 text-sm text-gray-500">

            <span>
              By{" "}
              <span className="font-medium text-gray-700">
                {post.author}
              </span>
            </span>

            <span className="font-medium text-blue-600">
              Read →
            </span>

          </div>

        </div>
      </Link>
    </article>
  );
}