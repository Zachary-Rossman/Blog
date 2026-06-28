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

  // =========================
  // FILTER LOGIC (SAFE)
  // =========================
  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter((post) => {
      const title = post.title ?? "";
      const body = post.body ?? "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        body.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "" || post.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, category]);

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostCard key={i} loading />
          ))}
        </div>
      </section>
    );
  }

  // =========================
  // EMPTY DATABASE STATE
  // =========================
  if (!posts || posts.length === 0) {
    return (
      <section className="border rounded-lg p-10 text-center">
        <h2 className="text-lg font-semibold">No posts yet</h2>
        <p className="text-gray-500 mt-2">
          Be the first to create a post in the community.
        </p>
      </section>
    );
  }

  const noResults = filteredPosts.length === 0;

  return (
    <section className="space-y-6" aria-label="Post list">

      {/* =========================
          SEARCH + FILTER CONTROLS
      ========================= */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <div className="flex flex-col gap-1 flex-1">
          <label htmlFor="search" className="text-sm font-medium">
            Search posts
          </label>

          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded p-2"
            placeholder="Search by title or content..."
          />
        </div>

        {/* CATEGORY */}
        <div className="flex flex-col gap-1 md:w-64">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded p-2"
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
        </div>
      </div>

      {/* =========================
          RESULTS COUNT
      ========================= */}
      <p className="text-sm text-gray-500" aria-live="polite">
        {filteredPosts.length} post
        {filteredPosts.length !== 1 ? "s" : ""} found
      </p>

      {/* =========================
          POSTS GRID
      ========================= */}
      <div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        aria-live="polite"
      >
        {noResults ? (
          <div className="col-span-full border rounded-lg p-10 text-center">
            <h2 className="text-lg font-semibold">No posts found</h2>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or category filter.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>

    </section>
  );
}