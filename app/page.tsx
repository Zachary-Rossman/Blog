import Button from "@/components/ui/Button";
import Hero from "@/components/layout/Hero";
import { posts } from "@/data/posts";
import PostList from "@/components/posts/PostList";

export default function Home() {

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