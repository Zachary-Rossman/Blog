import CreatePostForm from "@/components/posts/CreatePostForm";

export default function PostsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Posts</h1>

      <CreatePostForm />
    </div>
  );
}