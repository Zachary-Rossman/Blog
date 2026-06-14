import Button from "@/components/ui/Button";
import Hero from "@/components/layout/Hero";
import PostCard from "@/components/posts/PostCard";

export default function Home() {
  
  const posts = [
    {
      id: 1,
      title: "Learning Next.js",
      author: "Zach",
      likes: 12,
    },
    {
      id: 2,
      title: "Understanding Components",
      author: "Zach",
      likes: 7,
    },
    {
      id: 3,
      title: "My First Blog Post",
      author: "Zach",
      likes: 24,
    },
  ];


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
            />
            ))}
      </div>
  
    </>
  );
}