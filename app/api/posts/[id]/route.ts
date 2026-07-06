import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Post from "@/models/Post";

// ======================================================
// POST ROUTE: /api/posts/[id]
// ======================================================
//
// This route handles TWO critical operations:
//
// 1. DELETE a post
// 2. UPDATE a post
//
// Both operations require:
// - Authentication (user must be logged in)
// - Authorization (user must OWN the post)
//
// This is the core of "secure CRUD ownership control"
// in the application.
// ======================================================

/**
 * ======================================================
 * DELETE POST
 * ======================================================
 *
 * Flow:
 * 1. Connect to DB
 * 2. Read post ID from route
 * 3. Validate auth token
 * 4. Verify JWT
 * 5. Fetch post
 * 6. Check ownership
 * 7. Delete post
 *
 * Security rule:
 * Only the original author can delete their post.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    // Extract route parameter (post ID)
    const { id } = await params;

    // Read auth cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // If no token → user is not logged in
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify JWT integrity
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find the post in DB
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Ownership check (CRITICAL SECURITY STEP)
    if (
      post.authorId.toString() !== payload.userId
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete post after passing all checks
    await Post.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Post deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

/**
 * ======================================================
 * UPDATE POST
 * ======================================================
 *
 * Flow:
 * 1. Connect to DB
 * 2. Read post ID
 * 3. Authenticate user
 * 4. Verify JWT
 * 5. Confirm ownership
 * 6. Parse request body
 * 7. Update post fields
 *
 * Only the post owner can modify:
 * - title
 * - body
 * - category
 * - imageUrl
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    // Extract post ID
    const { id } = await params;

    // Read auth cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch post
    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Ownership check
    if (
      post.authorId.toString() !== payload.userId
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Read update payload
    const body = await request.json();

    // Apply updates
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: body.title,
        body: body.body,
        category: body.category,
        imageUrl: body.imageUrl,
      },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}