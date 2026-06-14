import { getPostById } from "@/lib/posts";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const postId = Number(id);

  const post = getPostById(postId);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  return (
  <article className="max-w-2xl mx-auto py-10 px-6 space-y-6">
    <h1 className="text-3xl font-bold">{post.title}</h1>
    
    <div className="text-sm text-gray-500">
      <p>By {post.author}</p>
      <p>Category: {post.category}</p>
      <p>Published: {post.publishedDate}</p>
    </div>

    <div className="flex gap-4 text-sm">
      <span>{post.likes} likes</span>
      <span>{post.comments} comments</span>
    </div>

    <hr />

    <p className="leading-7 text-gray-700">
      This is where the full post content will go later. For now we are
      simulating the body of the blog post.
    </p>
  </article>
  );
}