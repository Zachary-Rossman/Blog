import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  const posts = await Post.find()

  return NextResponse.json(posts);
}

  export async function POST(request: Request) {
    console.log(request);


    await connectDB();


    const body = await request.json();

    const post = await Post.create(body);

    return NextResponse.json(post);
    }