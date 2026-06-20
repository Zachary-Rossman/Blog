import Hero from "@/components/layout/Hero";
import PostList from "@/components/posts/PostList";


export default async function Home() {
  const response = await fetch("http://localhost:3000/api/posts");
  const posts = await response.json();

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