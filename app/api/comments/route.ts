import Comment from "@/models/Comment";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

// ======================================================
// POST /api/comments
// ======================================================
//
// Creates a new comment for a blog post.
//
// Workflow:
// 1. Connect to MongoDB.
// 2. Read the request body.
// 3. Validate required fields.
// 4. Create a new Comment document.
// 5. Return the created comment.
//
// Required request body:
//
// {
//   postId: string,
//   content: string,
//   imageUrl?: string
// }
//
// Notes:
// - imageUrl is optional and allows comments to include
//   an attached image.
// - Validation happens here before attempting to write
//   anything to the database.
// ======================================================

export async function POST(req: Request) {
  try {
    await connectDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

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

    const body = await req.json();

    const {
      postId,
      content,
      imageUrl,
    } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({
      postId,
      userId: payload.userId,
      content,
      imageUrl: imageUrl || undefined,
    });

    return NextResponse.json(comment, {
      status: 201,
    });

  } catch (error) {
    console.error("POST /comments error:", error);

    return NextResponse.json(
      {
        error: "Failed to create comment",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// GET /api/comments
// ======================================================
//
// Returns every comment for a single blog post.
//
// Query:
//
// /api/comments?postId=<postId>
//
// Workflow:
//
// 1. Connect to MongoDB.
// 2. Read the postId from the URL.
// 3. Validate that postId exists.
// 4. Fetch every comment for that post.
// 5. Fetch every referenced user.
// 6. Merge user information into each comment.
// 7. Return the enriched comment list.
//
// Why enrich comments?
//
// The Comment model only stores:
//
// - postId
// - userId
// - content
// - imageUrl
//
// The UI also needs the author's username (and possibly
// email later). Instead of making one request per comment,
// we:
//
// 1. Collect every userId.
// 2. Fetch every matching user in ONE query.
// 3. Build a lookup table.
// 4. Attach the user data to each comment.
//
// This avoids the classic "N+1 query problem" and is much
// more efficient.
// ======================================================

export async function GET(req: Request) {
  try {
    // Connect to MongoDB.
    await connectDB();

    // Read the postId from the query string.
    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");

    // A postId is required to know which comments
    // should be returned.
    if (!postId) {
      return NextResponse.json(
        {
          error: "postId is required",
        },
        {
          status: 400,
        }
      );
    }

    // Retrieve every comment for this post.
    //
    // Newest comments appear first.
    const comments = await Comment.find({
      postId,
    }).sort({
      createdAt: -1,
    });

    // --------------------------------------------------
    // Collect every userId referenced by the comments.
    //
    // Example:
    //
    // comments
    //   ↓
    // ["123", "456", "123"]
    // --------------------------------------------------
    const userIds = comments.map(
      (comment) => comment.userId
    );

    // --------------------------------------------------
    // Fetch every referenced user in one database query.
    //
    // Using $in prevents one query per comment.
    // --------------------------------------------------
    const users = await User.find({
      _id: {
        $in: userIds,
      },
    });

    // --------------------------------------------------
    // Create a fast lookup table.
    //
    // Instead of repeatedly searching through the users
    // array, a Map allows constant-time lookups.
    //
    // key:
    // userId
    //
    // value:
    // user document
    // --------------------------------------------------
    const userMap = new Map(
      users.map((user) => [
        user._id.toString(),
        user,
      ])
    );

    // --------------------------------------------------
    // Merge each comment with its corresponding user.
    //
    // The frontend now receives:
    //
    // {
    //   ...
    //   user: {
    //     _id,
    //     username,
    //     email
    //   }
    // }
    //
    // instead of only a raw userId.
    // --------------------------------------------------
    const enriched = comments.map((comment) => {
      const user = userMap.get(
        comment.userId.toString()
      );

      return {
        ...comment.toObject(),
        user: user
          ? {
              _id: user._id.toString(),
              username: user.username,
              email: user.email,
            }
          : null,
      };
    });

    // Return the completed comment list.
    return NextResponse.json(enriched);
  } catch (error) {
    // Keep backend errors visible during development
    // and server debugging.
    console.error("GET /comments error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch comments",
      },
      {
        status: 500,
      }
    );
  }
}