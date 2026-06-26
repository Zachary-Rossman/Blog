import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Post from "@/models/Post";

/**
 * ============================
 * DELETE POST
 * ============================
 * - Auth required
 * - Verify JWT
 * - Verify ownership
 * - Delete post
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ FIX: must await params
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Post.findByIdAndDelete(id);

    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

/**
 * ============================
 * UPDATE POST (PUT)
 * ============================
 * - Auth required
 * - Verify JWT
 * - Verify ownership
 * - Update title/category
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    // ✅ FIX: must await params
    const { id } = await params;

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.authorId.toString() !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title: body.title,
        category: body.category,
      },
      { new: true }
    );

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}