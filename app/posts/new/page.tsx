import CreatePostForm from "@/components/posts/CreatePostForm";

export default function NewPostPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold mb-6">
        Create a New Post
      </h1>

      <CreatePostForm />
    </main>
  );
}