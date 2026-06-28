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

  const filteredPosts = useMemo(() => {
    if (!posts) return [];

    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "" || post.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [posts, search, category]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostCard key={i} loading />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 flex-1"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 md:w-64"
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

      {/* Results Count */}
      <p className="text-sm text-gray-500">
        {filteredPosts.length} post
        {filteredPosts.length !== 1 ? "s" : ""} found
      </p>

      {/* Posts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div className="border rounded-lg p-8 text-center">
            <p className="text-gray-500">
              No posts match your search.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}