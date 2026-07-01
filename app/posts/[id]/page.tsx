import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  const posts = await res.json();

  const post = posts.find((p: any) => p._id === id);

  // NOT FOUND
  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Post not found
        </h1>

        <p className="text-gray-500">
          The post you're looking for doesn't exist or may have been removed.
        </p>

        <Link
          href="/posts"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
        >
          Back to Posts
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gray-50"
      aria-labelledby="post-title"
    >
      <article className="max-w-4xl mx-auto px-6 py-14 space-y-10">

        {/* HEADER */}
        <header className="space-y-5">

          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              {post.category}
            </p>

            <h1
              id="post-title"
              className="text-5xl font-bold tracking-tight text-gray-900"
            >
              {post.title}
            </h1>

            <p className="text-gray-500">
              Written by{" "}
              <span className="font-medium text-gray-700">
                {post.author}
              </span>
            </p>
          </div>

          {/* FEATURED IMAGE */}
          {post.imageUrl?.trim() && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full aspect-[16/9] object-contain rounded-2xl border bg-gray-100"
            />
          )}

        </header>

        {/* ARTICLE */}
        <section
          className="rounded-2xl border bg-white p-8 shadow-sm"
          aria-label="Post content"
        >
          <div className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700">
            <p className="whitespace-pre-wrap leading-8">
              {post.body}
            </p>
          </div>
        </section>

      </article>
    </main>
  );
}