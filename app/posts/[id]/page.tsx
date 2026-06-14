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

  return <h1>{post.title}</h1>;
}