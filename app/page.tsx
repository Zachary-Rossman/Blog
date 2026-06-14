import Button from "@/components/ui/Button";
import Hero from "@/components/layout/Hero";
import PostCard from "@/components/posts/PostCard";

export default function Home() {
  return (
    <>

      <Hero
        title="Welcome to Blog"
        description="A full-stack blog application built with Next.js."
      />

      <h1>Recent Posts</h1>

      <div className="flex flex-wrap gap-4">
      <PostCard
        title="Learning Next.js"
        author="Zach"
      />

      <PostCard
        title="Understanding Components"
        author="Zach"
      />

      <PostCard
        title="My First Blog Post"
        author="Zach"
      />
      </div>
  
    </>
  );
}