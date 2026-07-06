import Link from "next/link";
import CommentForm from "@/components/comments/CommentForm";
import { cookies } from "next/headers";
import PostReactionButton from "@/components/posts/PostReactionButton";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /**
   * =====================================================
   * COOKIE ACCESS (SERVER SIDE)
   * =====================================================
   *
   * cookies() gives access to request cookies in a Server Component.
   *
   * IMPORTANT:
   * - This runs on the server
   * - Used here to forward auth state to API requests
   *
   * authCookie:
   * - stringified cookie header
   * - passed into fetch manually for authenticated endpoints
   */
  const cookieStore = await cookies();
  const authCookie = cookieStore.toString();

  /**
   * =====================================================
   * POSTS FETCH (SERVER-SIDE RENDERING)
   * =====================================================
   *
   * cache: "no-store"
   * - forces fresh data on every request
   * - prevents stale post content
   *
   * DESIGN CHOICE:
   * - Fetches ALL posts
   * - Then filters in memory
   *
   * GOOD FOR LEARNING:
   * - simple
   *
   * NOT OPTIMAL FOR SCALE:
   * - should be GET /api/posts/:id
   */
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store",
  });

  const posts = await res.json();

  const post = posts.find((p: any) => p._id === id);

  /**
   * =====================================================
   * COMMENTS FETCH
   * =====================================================
   *
   * GET /api/comments?postId=id
   *
   * Returns all comments for this post.
   *
   * cache: "no-store"
   * - ensures real-time comment updates
   */
  const commentRes = await fetch(
    `http://localhost:3000/api/comments?postId=${id}`,
    {
      cache: "no-store",
    }
  );

  const comments = await commentRes.json();

  /**
   * =====================================================
   * REACTIONS FETCH (LIKE SYSTEM)
   * =====================================================
   *
   * KEY DETAIL:
   * - This endpoint depends on authentication
   * - Cookie is manually forwarded in headers
   *
   * Why?
   * - Server Components do NOT automatically include browser cookies in fetch
   */
  const reactionRes = await fetch(
    `http://localhost:3000/api/reactions?postId=${id}`,
    {
      cache: "no-store",
      headers: {
        Cookie: authCookie,
      },
    }
  );

  const reactionData = await reactionRes.json();

  /**
   * =====================================================
   * NOT FOUND STATE
   * =====================================================
   *
   * If post lookup fails after fetch:
   * - render clean fallback UI
   * - avoid crashing page
   */
  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Post not found</h1>

        <p className="text-gray-500">
          The post you're looking for doesn't exist or may have been removed.
        </p>

        <Link
          href="/posts"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Back to Posts
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50" aria-labelledby="post-title">
      <article className="max-w-4xl mx-auto px-6 py-14 space-y-10">

        {/* =====================================================
            POST HEADER SECTION
        ===================================================== */}
        <header className="space-y-5">

          <div className="space-y-2">

            {/* CATEGORY TAG */}
            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              {post.category}
            </p>

            {/* TITLE */}
            <h1
              id="post-title"
              className="text-5xl font-bold tracking-tight text-gray-900"
            >
              {post.title}
            </h1>

            {/* AUTHOR */}
            <p className="text-gray-500">
              Written by{" "}
              <span className="font-medium text-gray-700">
                {post.author}
              </span>
            </p>

          </div>

          {/* FEATURE IMAGE (OPTIONAL) */}
          {post.imageUrl?.trim() && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full aspect-[16/9] object-contain rounded-2xl border bg-gray-100"
            />
          )}

        </header>

        {/* =====================================================
            POST BODY
        ===================================================== */}
        <section
          className="rounded-2xl border bg-white p-8 shadow-sm"
          aria-label="Post content"
        >
          <p className="whitespace-pre-wrap leading-8 text-gray-700">
            {post.body}
          </p>
        </section>

        {/* =====================================================
            REACTION SYSTEM
        ===================================================== */}
        <section
          className="flex items-center justify-between rounded-2xl border bg-white p-6 shadow-sm"
          aria-label="Post reactions"
        >
          <div>
            <h2 className="text-lg font-semibold">
              Enjoyed this post?
            </h2>

            <p className="text-sm text-gray-500">
              Let the author know by leaving a like.
            </p>
          </div>

          <PostReactionButton
            postId={post._id}
            initialLiked={reactionData.liked}
            initialCount={reactionData.count}
          />
        </section>

        {/* =====================================================
            COMMENTS SECTION
        ===================================================== */}
        <section
          className="space-y-6 pt-6"
          aria-labelledby="comments-heading"
        >
          <h2
            id="comments-heading"
            className="text-2xl font-bold text-gray-900"
          >
            Comments
          </h2>

          {/* COMMENT FORM */}
          <CommentForm
            postId={post._id}
            userId={post.authorId}
          />

          {/* COMMENT LIST */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">
                No comments yet. Be the first to comment.
              </p>
            ) : (
              comments.map((comment: any) => (
                <div
                  key={comment._id}
                  className="rounded-2xl border bg-white p-5 shadow-sm space-y-3"
                >
                  {/* OPTIONAL IMAGE ATTACHMENT */}
                  {comment.imageUrl && (
                    <img
                      src={comment.imageUrl}
                      alt="Comment attachment"
                      className="w-full aspect-[16/9] object-contain rounded-lg border bg-gray-100"
                    />
                  )}

                  {/* COMMENT CONTENT */}
                  <p className="text-gray-800">
                    {comment.content}
                  </p>

                  {/* USER INFO */}
                  <p className="text-xs text-gray-500">
                    User:{" "}
                    {comment.user?.username ?? "Unknown user"}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>

      </article>
    </main>
  );
}