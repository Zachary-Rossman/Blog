"use client";

import { useState } from "react";
import Hero from "@/components/layout/Hero";
import PostList from "@/components/posts/PostList";
import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  function handleCreatePost(newPost: Post) {
    setPosts((prev) => [newPost, ...prev]);
  }

  return (
    <>
      <Hero
        title="Welcome to Blog"
        description="A full-stack blog application built with Next.js."
      />

      <h1>Recent Posts</h1>

      <PostList posts={posts} />
    </>
  );
}