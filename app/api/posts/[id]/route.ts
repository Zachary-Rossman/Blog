import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(params.id);

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 🔐 ownership check
  if (post.authorId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Post.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
};

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await Post.findById(params.id);

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 🔐 ownership check
  if (post.authorId !== payload.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();

  const updated = await Post.findByIdAndUpdate(
    params.id,
    {
      title: body.title,
      category: body.category,
    },
    { new: true }
  );

  return NextResponse.json(updated);
};