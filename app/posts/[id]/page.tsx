import Link from "next/link";
import CommentForm from "@/components/comments/CommentForm";
import PostReactionButton from "@/components/posts/PostReactionButton";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // =====================================================
  // POSTS
  // =====================================================

  const res = await fetch(
    "http://localhost:3000/api/posts",
    {
      cache: "no-store",
    }
  );

  const posts = await res.json();

  const post = posts.find(
    (p: any) => p._id === id
  );

  // =====================================================
  // COMMENTS
  // =====================================================

  const commentRes = await fetch(
    `http://localhost:3000/api/comments?postId=${id}`,
    {
      cache: "no-store",
    }
  );

  const comments = await commentRes.json();

  // =====================================================
  // REACTIONS (NEW)
  // =====================================================

  const reactionRes = await fetch(
    `http://localhost:3000/api/reactions?postId=${id}`,
    {
      cache: "no-store",
    }
  );

  const reactionData = await reactionRes.json();

  // =====================================================
  // NOT FOUND
  // =====================================================

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Post not found
        </h1>

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
    <main
      className="min-h-screen bg-gray-50"
      aria-labelledby="post-title"
    >
      <article className="max-w-4xl mx-auto px-6 py-14 space-y-10">

        {/* =====================================================
            POST HEADER
        ===================================================== */}

        <header className="space-y-5">

          <div className="space-y-2">

            <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
              {post.category}
            </p>

            <h1
              id="post-title"
              className="text-5xl font-bold tracking-tight text-gray-900"
            >
              {post.title}
            </h1>

            <p className="text-gray-500">
              Written by{" "}
              <span className="font-medium text-gray-700">
                {post.author}
              </span>
            </p>

          </div>

          {/* FEATURED IMAGE */}

          {post.imageUrl?.trim() && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full aspect-[16/9] object-contain rounded-2xl border bg-gray-100"
            />
          )}

        </header>

        {/* =====================================================
            ARTICLE BODY
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
            REACTIONS (NEW)
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
            userId={post.authorId}
            initialLiked={false}
            initialCount={reactionData.count}
          />

        </section>

        {/* =====================================================
            COMMENTS
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

          <CommentForm
            postId={post._id}
            userId={post.authorId}
          />

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

                  {comment.imageUrl && (
                    <img
                      src={comment.imageUrl}
                      alt="Comment attachment"
                      className="w-full aspect-[16/9] object-contain rounded-lg border bg-gray-100"
                    />
                  )}

                  <p className="text-gray-800">
                    {comment.content}
                  </p>

                  <p className="text-xs text-gray-500">
                    User:{" "}
                    {comment.user?.username ??
                      "Unknown user"}
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