import { getPosts } from "@/lib/posts";
import Hero from "@/components/layout/Hero";
import PostList from "@/components/posts/PostList";

/**
 * =====================================================
 * HOME PAGE (ROOT ROUTE)
 * =====================================================
 *
 * PURPOSE:
 * - Landing page of the application
 * - Combines:
 *    • Hero marketing section
 *    • Featured posts preview
 *    • Recent posts feed
 *
 * DATA STRATEGY:
 * - Fetches all posts from API route
 * - Uses `no-store` to ensure fresh data on every request
 *   (disables Next.js caching for real-time feed behavior)
 *
 * NOTE:
 * - This is a server component (async function)
 * - No client-side state is used here
 */
export default async function Home() {
  const posts = await getPosts();

  // =====================================================
  // DATA SPLITTING FOR UI STRUCTURE
  // =====================================================
  const featuredPosts = posts.slice(0, 2);
  const recentPosts = posts.slice(2, 8);

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <Hero
        title="Build. Learn. Share."
        description="A modern full-stack blogging platform where developers can publish tutorials, document projects, and share ideas with the community."
      />

      {/* =====================================================
          FEATURED POSTS
      ===================================================== */}
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

      {/* =====================================================
          RECENT POSTS
      ===================================================== */}
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