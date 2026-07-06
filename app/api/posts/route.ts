import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

/**
 * =========================================================
 * GET /api/posts
 * =========================================================
 * PURPOSE:
 * Returns ALL blog posts in the system (public feed).
 *
 * This is used for:
 * - Homepage feed
 * - Public /posts page
 * - Discovery browsing
 *
 * =========================================================
 * DATA FLOW:
 * =========================================================
 * 1. Fetch all posts from MongoDB
 * 2. Sort by publishedDate (newest first)
 * 3. Enrich each post with author username
 *
 * NOTE:
 * This uses manual population via User.findById()
 * instead of Mongoose populate.
 *
 * Tradeoff:
 * - Simple to understand
 * - Slightly inefficient at scale (N+1 queries)
 *
 * Upgrade path:
 * - Use .populate("authorId") in Post model
 * - OR aggregation pipeline
 *
 * =========================================================
 * RESPONSE SHAPE:
 * =========================================================
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
  await connectDB();

  const posts = await Post.find().sort({ publishedDate: -1 });

  const postsWithUsers = await Promise.all(
    posts.map(async (post) => {
      const user = await User.findById(post.authorId);

      return {
        _id: post._id,
        title: post.title,
        body: post.body,
        category: post.category,
        imageUrl: post.imageUrl,
        publishedDate: post.publishedDate,
        likes: post.likes,
        comments: post.comments,

        // human-readable author field
        author: user ? user.username : "Unknown",

        authorId: post.authorId,
      };
    })
  );

  return NextResponse.json(postsWithUsers);
}

/**
 * =========================================================
 * POST /api/posts
 * =========================================================
 * PURPOSE:
 * Creates a new blog post
 *
 * AUTH REQUIREMENT:
 * - Must be logged in (JWT in cookies)
 *
 * =========================================================
 * AUTH FLOW:
 * =========================================================
 * 1. Read auth_token from cookies
 * 2. Verify JWT using verifyToken()
 * 3. Extract userId
 * 4. Confirm user exists in database
 *
 * This ensures:
 * - Only valid users can create posts
 * - Posts are always tied to real DB users
 *
 * =========================================================
 * SECURITY NOTE:
 * =========================================================
 * The authorId is ALWAYS taken from the server-side token.
 * It is NOT trusted from the client request body.
 *
 * This prevents:
 * - impersonation
 * - fake authorship injection
 *
 * =========================================================
 * POST CREATION FLOW:
 * =========================================================
 * 1. Validate authentication
 * 2. Read request body AFTER auth
 * 3. Create Post document
 * 4. Attach authorId from verified user
 * 5. Return created post
 * =========================================================
 */

export async function POST(request: Request) {
  try {
    await connectDB();

    // -----------------------------
    // 1. Get token from cookies
    // -----------------------------
    const cookieStore = cookies();
    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // -----------------------------
    // 2. Verify JWT
    // -----------------------------
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // -----------------------------
    // 3. Validate user exists
    // -----------------------------
    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // -----------------------------
    // 4. Read request body
    // (only AFTER auth is confirmed)
    // -----------------------------
    const body = await request.json();

    // -----------------------------
    // 5. Create post
    // -----------------------------
    const post = await Post.create({
      title: body.title,
      body: body.body,
      category: body.category,
      imageUrl: body.imageUrl,

      // SERVER-SIDE OWNERSHIP ENFORCEMENT
      authorId: user._id,
    });

    return NextResponse.json(post);
  } catch (error) {
    // Backend logging preserved for debugging
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}