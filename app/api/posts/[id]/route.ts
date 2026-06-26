import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/auth";

import Post from "@/models/Post";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }>}) {
    try {
        await connectDB();

        const { id } = await params;

        // 1. Get token
        const cookieStore = await cookies();

        const token = cookieStore.get("auth_token")?.value;

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

        // 3. Find post
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        // 4. Verify ownership
        if (post.authorId.toString() !== payload.userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 5. Delete post
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