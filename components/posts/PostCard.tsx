"use client";

import Link from "next/link";

/**
 * =========================================
 * POST TYPE
 * =========================================
 * This defines the shape of a post object
 * coming from the backend or parent component.
 *
 * NOTE:
 * - _id is MongoDB identifier
 * - imageUrl is optional because not all posts have images
 */
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

  /**
   * =========================================
   * LOADING STATE (SKELETON UI)
   * =========================================
   *
   * This is a "skeleton loader" pattern.
   * It improves UX by showing structure
   * while data is being fetched.
   *
   * IMPORTANT:
   * - No real data is used here
   * - Only gray placeholders
   */
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

  /**
   * SAFETY CHECK
   * If no post is passed, render nothing.
   *
   * NOTE:
   * This prevents runtime crashes if parent
   * data is missing or undefined.
   */
  if (!post) return null;

  return (
    <article>

      {/* =========================================
          LINK WRAPPER
      =========================================
          Entire card is clickable and routes to
          individual post page.
      */}
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

        {/* =========================================
            OPTIONAL IMAGE
        =========================================
            Only renders if imageUrl exists and is valid.
        */}
        {post.imageUrl?.trim() && (
          <img
            src={post.imageUrl}
            alt={post.title}
            loading="lazy"
            className="w-full aspect=[16/9] object-cover"
          />
        )}

        <div className="space-y-4 p-6">

          {/* =========================================
              CATEGORY BADGE
          =========================================
              Used for visual grouping of posts.
              Could later be replaced with dynamic tags.
          */}
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

          {/* =========================================
              FOOTER SECTION
          =========================================
              Displays author info and CTA.
              This is also where future enhancements
              like likes/comments preview can be added.
          */}
          <div className="flex items-center justify-between pt-2 text-sm text-gray-500">

            <span>
              By{" "}
              <span className="font-medium text-gray-700">
                {post.author}
              </span>
            </span>

            {/* CTA */}
            <span className="font-medium text-blue-600">
              Read →
            </span>

          </div>

        </div>
      </Link>
    </article>
  );
}