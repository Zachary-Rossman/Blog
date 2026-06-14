import { posts } from "@/data/posts";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const postId = Number(id);

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  return <h1>{post.title}</h1>;
}