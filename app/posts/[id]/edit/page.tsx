import { notFound } from "next/navigation";
import { getPost } from "@/lib/posts";
import EditPostForm from "@/components/posts/EditPostForm";

/**
 * ======================================================
 * EDIT POST PAGE
 * ======================================================
 *
 * Dynamic Route:
 *
 * /posts/[id]/edit
 *
 * PURPOSE
 * -------
 * Displays the edit form for an existing blog post.
 *
 * This is a Server Component.
 *
 * Responsibilities:
 *
 * • Read the dynamic route parameter.
 * • Retrieve the matching post from MongoDB.
 * • Return a 404 page if the post does not exist.
 * • Pass the existing values into EditPostForm.
 *
 * NOTE
 * ----
 * Loading UI is handled by:
 *
 * app/posts/[id]/edit/loading.tsx
 *
 * Unexpected render/database errors are handled by:
 *
 * app/posts/[id]/edit/error.tsx
 * ======================================================
 */

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({
  params,
}: Props) {
  /**
   * ======================================================
   * READ ROUTE PARAMETER
   * ======================================================
   *
   * Dynamic routes provide the post ID through params.
   *
   * Example:
   *
   * /posts/685d123/edit
   *
   * becomes:
   *
   * id = "685d123"
   * ======================================================
   */
  const { id } = await params;

  /**
   * ======================================================
   * FETCH POST
   * ======================================================
   *
   * Retrieve the post directly from MongoDB using the
   * shared database layer.
   *
   * This avoids making an unnecessary HTTP request to
   * our own API route.
   * ======================================================
   */
  const post = await getPost(id);

  /**
   * ======================================================
   * NOT FOUND STATE
   * ======================================================
   *
   * If the post cannot be found, immediately render the
   * built-in Next.js 404 page.
   * ======================================================
   */
  if (!post) {
    notFound();
  }

  /**
   * ======================================================
   * PAGE UI
   * ======================================================
   *
   * This page is intentionally lightweight.
   *
   * Responsibilities:
   *
   * • Display page layout.
   * • Pass existing post values into EditPostForm.
   *
   * Form submission and validation are handled by the
   * EditPostForm component.
   * ======================================================
   */
  return (
    <main
      className="min-h-[calc(100vh-4rem)] bg-gray-50 px-6 py-12"
      aria-labelledby="edit-post-heading"
    >
      <div className="mx-auto max-w-2xl space-y-8">
        {/* ==================================================
            PAGE HEADER
        =================================================== */}
        <header className="space-y-2 text-center">
          <h1
            id="edit-post-heading"
            className="text-4xl font-bold tracking-tight text-gray-900"
          >
            Edit Post
          </h1>

          <p className="text-gray-600">
            Update your article and save your changes.
          </p>
        </header>

        {/* ==================================================
            EDIT FORM
        =================================================== */}
        <section
          className="rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="Edit post form"
        >
          <EditPostForm
            id={post._id.toString()}
            initialTitle={post.title}
            initialBody={post.body}
            initialImageUrl={post.imageUrl}
            initialCategory={post.category}
          />
        </section>
      </div>
    </main>
  );
}