import Link from "next/link";
import { cookies } from "next/headers";

import { getPost } from "@/lib/posts";

import CommentForm from "@/components/comments/CommentForm";
import PostReactionButton from "@/components/posts/PostReactionButton";


/**
 * =====================================================
 * POST DETAIL PAGE
 * =====================================================
 *
 * Route:
 *
 * /posts/[id]
 *
 * PURPOSE:
 * - Display a single blog post.
 * - Display reactions.
 * - Display comments.
 * - Allow authenticated users to interact.
 *
 * This is a Server Component.
 *
 * Data responsibilities:
 *
 * - Retrieve post directly from MongoDB.
 * - Retrieve comments through API route.
 * - Retrieve reaction state through API route.
 *
 * IMPORTANT:
 * Server Components should avoid fetching their own
 * API routes when possible.
 *
 * Database logic belongs in:
 *
 * /lib
 *
 * API routes are primarily for:
 *
 * - Client Components
 * - External consumers
 * - Browser requests
 * =====================================================
 */


export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  /**
   * =====================================================
   * READ DYNAMIC ROUTE PARAMETER
   * =====================================================
   *
   * Example:
   *
   * /posts/685d123
   *
   * gives:
   *
   * id = "685d123"
   *
   * =====================================================
   */

  const { id } = await params;



  /**
   * =====================================================
   * FETCH POST FROM DATABASE
   * =====================================================
   *
   * IMPORTANT ARCHITECTURE CHANGE:
   *
   * Previous approach:
   *
   * Server Component
   *      |
   *      fetch("/api/posts")
   *      |
   *      API Route
   *      |
   *      MongoDB
   *
   *
   * New approach:
   *
   * Server Component
   *      |
   *      getPost(id)
   *      |
   *      MongoDB
   *
   *
   * Why this is better:
   *
   * - No unnecessary HTTP request
   * - Works correctly in Vercel production
   * - Cleaner separation of responsibilities
   * =====================================================
   */

  const post = await getPost(id);



  /**
   * =====================================================
   * AUTH COOKIE ACCESS
   * =====================================================
   *
   * Reactions require authentication information.
   *
   * Server Components do not automatically forward
   * cookies when manually fetching API routes.
   *
   * Therefore:
   *
   * 1. Read cookies from request.
   * 2. Forward cookie header manually.
   *
   * =====================================================
   */

  const cookieStore = await cookies();

  const authCookie = cookieStore.toString();



  /**
   * =====================================================
   * FETCH COMMENTS
   * =====================================================
   *
   * Comments are loaded through the API route.
   *
   * Why not directly from MongoDB?
   *
   * Current architecture:
   *
   * - Comment logic lives behind API endpoint.
   * - Easy to later convert comments into a client
   *   updated system.
   *
   * no-store:
   *
   * Ensures new comments appear immediately.
   *
   * =====================================================
   */

  let comments = [];

  try {

    const commentRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/comments?postId=${id}`,
      {
        cache: "no-store",
      }
    );


    comments = await commentRes.json();


  } catch (error) {

    console.error(
      "Comment loading failed:",
      error
    );

  }



  /**
   * =====================================================
   * FETCH REACTION DATA
   * =====================================================
   *
   * Returns:
   *
   * - Number of likes
   * - Whether current user liked the post
   *
   * Cookie forwarding allows the API route
   * to identify the logged-in user.
   *
   * =====================================================
   */

  let reactionData = {
    liked: false,
    count: 0,
  };


  try {

    const reactionRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/reactions?postId=${id}`,
      {
        cache: "no-store",
        headers: {
          Cookie: authCookie,
        },
      }
    );


    reactionData = await reactionRes.json();


  } catch (error) {

    console.error(
      "Reaction loading failed:",
      error
    );

  }



  /**
   * =====================================================
   * NOT FOUND STATE
   * =====================================================
   */

  if (!post) {

    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center space-y-4">

        <h1 className="text-2xl font-bold">
          Post not found
        </h1>


        <p className="text-gray-500">
          The post you're looking for doesn't exist
          or may have been removed.
        </p>


        <Link
          href="/posts"
          className="inline-flex rounded-lg bg-blue-600 px-5 py-3 text-white"
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



        <header className="space-y-5">


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



          {post.imageUrl?.trim() && (

            <img
              src={post.imageUrl}
              alt={`${post.title} featured image`}
              className="w-full aspect-[16/9] object-contain rounded-2xl border bg-gray-100"
            />

          )}


        </header>




        <section
          className="rounded-2xl border bg-white p-8 shadow-sm"
          aria-label="Post content"
        >

          <p className="whitespace-pre-wrap leading-8 text-gray-700">
            {post.body}
          </p>

        </section>




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
            postId={post._id.toString()}
            initialLiked={reactionData.liked}
            initialCount={reactionData.count}
          />

        </section>




        <section
          className="space-y-6 pt-6"
          aria-labelledby="comments-heading"
        >

          <h2
            id="comments-heading"
            className="text-2xl font-bold"
          >
            Comments
          </h2>



          <CommentForm
            postId={post._id.toString()}
          />



          <div className="space-y-4">


            {comments.length === 0 ? (

              <p className="text-gray-500">
                No comments yet. Be the first to comment.
              </p>


            ) : (

              comments.map((comment: any) => (

                <article
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
                    {comment.user?.username ?? "Unknown user"}
                  </p>


                </article>

              ))

            )}

          </div>


        </section>


      </article>


    </main>

  );
}