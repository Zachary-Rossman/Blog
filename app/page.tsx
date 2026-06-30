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
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">

      {/* HERO */}
      <Hero
        title="Build. Learn. Share."
        description="A modern full-stack blogging platform where developers can publish tutorials, document projects, and share ideas with the community."
      />

      {/* FEATURED SECTION */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Featured Posts
          </h2>

          <p className="text-gray-500 mt-1">
            Articles we think you'll enjoy first.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <PostList posts={featuredPosts} />
        </div>
      </section>

      {/* RECENT SECTION */}
      <section>
        <div className="mb-6">
          <h2 className="text-3xl font-bold">
            Recent Posts
          </h2>

          <p className="text-gray-500 mt-1">
            Articles that have been posted recently.
          </p>
        </div>

        <div className="space-y-4">
          <PostList posts={recentPosts} />
        </div>
      </section>

    </main>
  );
}