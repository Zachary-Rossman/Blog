import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import CreatePostForm from "@/components/posts/CreatePostForm";

export default async function NewPostPage() {
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  // 🔐 AUTH GUARD (SERVER SIDE)
  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);

  if (!payload) {
    redirect("/login");
  }

  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-12"
      aria-labelledby="create-post-title"
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* HEADER */}
        <header className="space-y-2 text-center">
          <h1
            id="create-post-title"
            className="text-4xl font-bold tracking-tight text-gray-900"
          >
            Create a New Post
          </h1>

          <p className="text-gray-600">
            Share your thoughts, tutorials, or ideas with the community.
          </p>
        </header>

        {/* FORM CARD */}
        <section
          className="bg-white border rounded-2xl shadow-sm p-6"
          aria-label="Create post form"
        >
          <CreatePostForm />
        </section>

      </div>
    </main>
  );
}