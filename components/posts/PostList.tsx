"use client";

import { useMemo, useState } from "react";
import PostCard from "./PostCard";

type Post = {
  _id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  imageUrl?: string;
};

export default function PostList({
  posts,
  loading = false,
}: {
  posts?: Post[];
  loading?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  /**
   * =========================================
   * FILTERING LOGIC (CLIENT SIDE)
   * =========================================
   *
   * We use useMemo here to avoid recalculating
   * filtered posts on every render unless:
   * - posts changes
   * - search changes
   * - category changes
   *
   * This is a performance optimization pattern.
   */
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter((post) => {
      const title = post.title ?? "";
      const body = post.body ?? "";

      /**
       * SEARCH MATCH
       * We check both title and body so users can
       * search naturally without needing exact titles.
       */
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        body.toLowerCase().includes(search.toLowerCase());

      /**
       * CATEGORY MATCH
       * If no category is selected → allow all posts
       * Otherwise filter strictly by category
       */
      const matchesCategory =
        category === "" || post.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, category]);

  // =========================
  // DEBUG NOTE (optional learning aid)
  // =========================
  // You can uncomment this if debugging filtering issues:
  // console.log("Filtered Posts:", filteredPosts);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCard key={i} loading />
          ))}
        </div>
      </section>
    );
  }

  // =========================
  // EMPTY STATE (NO POSTS IN DB)
  // =========================
  if (!posts || posts.length === 0) {
    return (
      <section className="rounded-2xl border bg-white p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold">No posts yet</h2>

        <p className="mt-3 text-gray-500">
          Be the first person to publish something.
        </p>
      </section>
    );
  }

  const noResults = filteredPosts.length === 0;

  return (
    <section className="space-y-8" aria-label="Post list">

      {/* =====================================================
          SEARCH + FILTER CONTROLS
      ===================================================== */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        <div className="grid gap-6 md:grid-cols-[1fr_250px]">

          {/* SEARCH INPUT */}
          <div>
            <label
              htmlFor="search"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Search Posts
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or content..."
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500
              "
            />

            {/* NOTE:
                This is a controlled input.
                React state drives the value.
            */}
          </div>

          {/* CATEGORY FILTER */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="
                w-full
                rounded-xl
                border
                px-4
                py-3
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500
              "
            >
              <option value="">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Programming">Programming</option>
              <option value="Career">Career</option>
              <option value="Gaming">Gaming</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Tutorial">Tutorial</option>
            </select>

            {/* NOTE:
                This is a simple enum-based filter.
                Later we could replace this with dynamic categories
                from the database.
            */}
          </div>

        </div>
      </div>

      {/* =====================================================
          RESULTS HEADER
      ===================================================== */}
      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">Posts</h2>

        <p className="text-sm text-gray-500" aria-live="polite">
          {filteredPosts.length} result
          {filteredPosts.length !== 1 ? "s" : ""}
        </p>

      </div>

      {/* =====================================================
          POST GRID
      ===================================================== */}
      <div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
      >
        {noResults ? (
          <div className="col-span-full rounded-2xl border bg-white p-12 text-center shadow-sm">

            <h2 className="text-2xl font-bold">
              Nothing matched your search
            </h2>

            <p className="mt-3 text-gray-500">
              Try another keyword or choose a different category.
            </p>

          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
            />
          ))
        )}
      </div>

    </section>
  );
}