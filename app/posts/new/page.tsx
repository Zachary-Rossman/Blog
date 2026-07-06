import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import CreatePostForm from "@/components/posts/CreatePostForm";

export default async function NewPostPage() {
  /**
   * =====================================================
   * SERVER-SIDE COOKIE ACCESS
   * =====================================================
   *
   * cookies() in App Router:
   * - runs only on server
   * - reads request cookies directly
   *
   * Used here for authentication gating.
   */
  const cookieStore = await cookies();

  const token = cookieStore.get("auth_token")?.value;

  /**
   * =====================================================
   * AUTH GUARD (FIRST LAYER)
   * =====================================================
   *
   * This is a SERVER COMPONENT protection layer.
   *
   * WHY THIS MATTERS:
   * - prevents unauthenticated users from even seeing UI
   * - more secure than client-side redirects
   *
   * FLOW:
   * 1. Check cookie exists
   * 2. If missing → redirect immediately
   */
  if (!token) {
    redirect("/login");
  }

  /**
   * =====================================================
   * JWT VERIFICATION
   * =====================================================
   *
   * verifyToken():
   * - decodes JWT
   * - ensures token integrity
   *
   * IMPORTANT:
   * Even if token exists, it may be:
   * - expired
   * - tampered
   * - invalid signature
   */
  const payload = verifyToken(token);

  if (!payload) {
    redirect("/login");
  }

  /**
   * =====================================================
   * SUCCESS PATH
   * =====================================================
   *
   * At this point:
   * - user is authenticated
   * - token is valid
   *
   * We safely render form UI.
   */
  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-12"
      aria-labelledby="create-post-title"
    >
      <div className="max-w-2xl mx-auto space-y-8">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
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

        {/* =====================================================
            FORM CONTAINER
        ===================================================== */}
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