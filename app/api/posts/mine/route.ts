import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = cookies();

    const token = (await cookieStore).get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const posts = await Post.find({
      authorId: user._id,
    }).sort({
      publishedDate: -1,
    });

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
          author: author ? author.username : "Unknown",
          authorId: post.authorId,
        };
      })
    );

    return NextResponse.json(postsWithUsers);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}