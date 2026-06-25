import Hero from "@/components/layout/Hero";
import PostList from "@/components/posts/PostList";

export default async function Home() {
  const response = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store", // ensures fresh feed every load
  });

  const posts = await response.json();

  // split for UX structure
  const featuredPosts = posts.slice(0, 2);
  const recentPosts = posts.slice(2, 8);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      {/* HERO */}
      <Hero
        title="Welcome to Blog"
        description="A full-stack blog application built with Next.js."
      />

      {/* FEATURED SECTION */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Featured Posts
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <PostList posts={featuredPosts} />
        </div>
      </section>

      {/* RECENT SECTION */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Latest Posts
        </h2>

        <div className="space-y-4">
          <PostList posts={recentPosts} />
        </div>
      </section>

    </main>
  );
}