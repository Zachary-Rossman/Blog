import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import User from "@/models/User";

// =======================
// CREATE COMMENT (POST)
// =======================
export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { postId, userId, content, imageUrl } = body;

    if (!postId || !userId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      postId,
      userId,
      content,
      imageUrl: imageUrl || undefined,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("POST /comments error:", error);

    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// =======================
// GET COMMENTS (GET)
// =======================
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    // extract user IDs
    const userIds = comments.map((c) => c.userId);

    // fetch users in one query
    const users = await User.find({ _id: { $in: userIds } });

    // map users by id for fast lookup
    const userMap = new Map(
      users.map((u) => [u._id.toString(), u])
    );

    // FIXED: proper map syntax
    const enriched = comments.map((c) => {
      const user = userMap.get(c.userId.toString());

      return {
        ...c.toObject(),
        user: user
          ? {
              _id: user._id.toString(),
              username: user.username,
              email: user.email,
            }
          : null,
      };
    });

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("GET /comments error:", error);

    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}