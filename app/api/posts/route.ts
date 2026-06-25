import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await connectDB();

  const posts = await Post.find().sort({ publishedDate: -1 });

  const postsWithUsers = await Promise.all(
    posts.map(async (post) => {
      const user = await User.findById(post.authorId);

      return {
        _id: post._id,
        title: post.title,
        category: post.category,
        publishedDate: post.publishedDate,
        likes: post.likes,
        comments: post.comments,
        author: user ? user.username : "Unknown",
        authorId: post.authorId,
      };
    })
  );

  return NextResponse.json(postsWithUsers);
}

  export async function POST(request: Request) {
    try {
      await connectDB();

      // 1. Get token from cookie
      const cookieStore = cookies();
      const token = (await cookieStore).get("auth_token")?.value;

      if (!token) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // 2. Verify token
      const payload = verifyToken(token);

      if (!payload) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // 3. Find user in db
      const user = await User.findById(payload.userId);

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // 4. Read request body (ONLY after auth)
      const body = await request.json();

      // 5. Create post with server-owned identity
      const post = await Post.create({
        title: body.title,
        category: body.category,
        authorId: user._id,
      });

      return NextResponse.json(post);
      } catch (error) {
        console.error(error);

        return NextResponse.json(
          { error: "Server Error" },
          { status: 500 }
        );
      }
    }