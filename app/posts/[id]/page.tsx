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

  if (!post) {
    return (
      <div className="p-10 text-center">
        Post not found
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <p className="text-gray-500 mb-6">
        {post.category} · by {post.author}
      </p>

      <div className="border-t pt-6">
        <p>This is where your post content will go.</p>
      </div>
    </main>
  );
}