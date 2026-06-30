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

  // ❌ NOT FOUND STATE
  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Post not found</h1>

        <p className="text-gray-500">
          The post you’re looking for doesn’t exist or may have been removed.
        </p>

        <a
          href="/posts"
          className="inline-block mt-4 rounded-lg bg-black px-5 py-2 text-white"
        >
          Back to Posts
        </a>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-gray-50"
      aria-labelledby="post-title"
    >
      {/* CONTENT WRAPPER */}
      <article className="max-w-3xl mx-auto px-6 py-14 space-y-8">

        {/* HEADER */}
        <header className="space-y-4">
          <h1
            id="post-title"
            className="text-4xl font-bold tracking-tight text-gray-900"
          >
            {post.title}
          </h1>

          <p className="text-gray-500 text-sm">
            <span className="font-medium text-gray-700">
              {post.author}
            </span>
            {" "}· {post.category}
          </p>
        </header>

        {/* BODY CARD */}
        <section
          className="bg-white border rounded-2xl shadow-sm p-8"
          aria-label="Post content"
        >
          <div className="prose prose-gray max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
              {post.body}
            </p>
          </div>
        </section>

      </article>
    </main>
  );
}