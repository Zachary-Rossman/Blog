import Button from "@/components/ui/Button";
import Hero from "@/components/layout/Hero";
import PostCard from "@/components/posts/PostCard";
import { posts } from "@/data/posts";

export default function Home() {

  return (
    <>

      <Hero
        title="Welcome to Blog"
        description="A full-stack blog application built with Next.js."
      />

      <h1>Recent Posts</h1>

      <div className="flex flex-wrap gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            author={post.author}
            likes={post.likes}
            comments={post.comments}
            />
            ))}
      </div>
  
    </>
  );
}