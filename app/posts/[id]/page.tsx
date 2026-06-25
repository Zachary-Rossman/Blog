export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `http://localhost:3000/api/posts`,
    { cache: "no-store" }
  );

  const posts = await res.json();

  const post = posts.find(
    (p: any) => p._id === params.id
  );

  if (!post) {
    return (
      <div className="p-10 text-center">
        Post not found
      </div>
    );
  }

  return (
  <main className="max-w-3xl mx-auto px-6 py-12">

    {/* Back navigation */}
    <a
      href="/posts"
      className="text-sm text-gray-500 hover:text-black"
    >
      ← Back to posts
    </a>

    {/* Title */}
    <h1 className="text-4xl font-bold mt-6 mb-3 leading-tight">
      {post.title}
    </h1>

    {/* Meta bar */}
    <div className="flex items-center gap-3 text-sm text-gray-500 mb-10">
      <span className="font-medium text-gray-700">
        {post.author}
      </span>

      <span>•</span>

      <span>{post.category}</span>

      <span>•</span>

      <span>
        {new Date(post.publishedDate).toDateString()}
      </span>
    </div>

    {/* Divider */}
    <div className="border-t mb-8" />

    {/* Content */}
    <article className="prose prose-lg max-w-none">
      <p>
        This is where the post content will eventually live.
      </p>
    </article>

    {/* Actions (future ready) */}
    <div className="mt-10 flex gap-4 text-sm">
      <button className="hover:text-blue-600">
        👍 Like
      </button>

      <button className="hover:text-blue-600">
        💬 Comment
      </button>
    </div>

  </main>
);
}