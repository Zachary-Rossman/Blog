import { posts } from "@/data/posts";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);

  return NextResponse.json({
    message: "Post received",
    body,
  });
}