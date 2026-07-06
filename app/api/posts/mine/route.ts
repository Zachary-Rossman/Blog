import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

/**
 * =========================================================
 * GET /api/posts/mine
 * =========================================================
 * PURPOSE:
 * Returns all posts created by the currently authenticated user.
 *
 * This is used in:
 * - User dashboard ("My Posts")
 * - Personal post management views
 *
 * =========================================================
 * AUTH FLOW:
 * =========================================================
 * 1. Read JWT token from HTTP-only cookie (auth_token)
 * 2. Verify token using verifyToken()
 * 3. Extract userId from decoded payload
 * 4. Validate user exists in database
 *
 * If any step fails → return 401 Unauthorized
 *
 * =========================================================
 * DATABASE FLOW:
 * =========================================================
 * 1. Query Post collection where authorId === user._id
 * 2. Sort posts by publishedDate (newest first)
 * 3. Enrich each post with:
 *    - username (from User collection)
 *    - full post data (title, body, category, etc.)
 *
 * NOTE:
 * This is NOT optimized for scale yet because it performs
 * a per-post user lookup. For large apps, this should be
 * replaced with:
 * - MongoDB population (.populate)
 * - OR aggregation pipeline
 *
 * =========================================================
 * RESPONSE SHAPE:
 * =========================================================
 * Returns:
 * [
 *   {
 *     _id,
 *     title,
 *     body,
 *     category,
 *     imageUrl,
 *     publishedDate,
 *     likes,
 *     comments,
 *     author (username),
 *     authorId
 *   }
 * ]
 * =========================================================
 */

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Retrieve cookie store (server-side)
    const cookieStore = cookies();

    // Extract JWT from auth cookie
    const token = (await cookieStore).get("auth_token")?.value;

    // If no token → user is not authenticated
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Validate JWT and extract payload
    const payload = verifyToken(token);

    // If invalid token → reject request
    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user in database (ensures account still exists)
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch posts belonging to this user
    const posts = await Post.find({
      authorId: user._id,
    }).sort({
      publishedDate: -1,
    });

    /**
     * Enrichment step:
     * For each post, attach username from User collection.
     *
     * NOTE:
     * This is a simple join pattern done manually.
     * In production, prefer .populate() or aggregation.
     */
    const postsWithUsers = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.authorId);

        return {
          _id: post._id,
          title: post.title,
          body: post.body,
          category: post.category,
          imageUrl: post.imageUrl,
          publishedDate: post.publishedDate,
          likes: post.likes,
          comments: post.comments,

          // Display-friendly username
          author: author ? author.username : "Unknown",

          authorId: post.authorId,
        };
      })
    );

    // Return final enriched dataset
    return NextResponse.json(postsWithUsers);
  } catch (error) {
    // Backend error logging (kept intentionally for debugging)
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}