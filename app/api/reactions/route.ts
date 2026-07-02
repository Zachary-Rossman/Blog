import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Reaction from "@/models/Reaction";

// ======================================================
// CREATE REACTION
// ======================================================
// Creates a single reaction for a user on a post.
//
// Because the Reaction model has a unique index on
// (postId + userId), the same user cannot like the
// same post more than once.
//
// In the future, this route will probably become a
// "toggle" endpoint (like/unlike), but for now it
// simply creates a reaction.
// ======================================================

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse incoming JSON
    const body = await req.json();

    const { postId, userId, type } = body;

    // Validate required fields
    if (!postId || !userId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the reaction document
    const reaction = await Reaction.create({
      postId,
      userId,
      type,
    });

    // Return the newly-created reaction
    return NextResponse.json(reaction, {
      status: 201,
    });
  } catch (error: any) {
    console.error("POST /reactions error:", error);

    // --------------------------------------------------
    // Duplicate key error
    //
    // This happens if the same user tries to react
    // to the same post twice because of the unique
    // index in the Reaction model.
    // --------------------------------------------------
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error: "You have already reacted to this post.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create reaction",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// GET REACTIONS
// ======================================================
// Returns reaction information for a single post.
//
// Currently this endpoint only returns:
//
// {
//   count: number
// }
//
// Later we'll expand this to include:
//
// {
//   count: number,
//   reacted: boolean
// }
//
// so the frontend knows whether the current user has
// already liked the post.
// ======================================================

export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Read the postId from the query string
    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");

    // Validate required query parameter
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

    // --------------------------------------------------
    // Count reactions without loading every document.
    //
    // countDocuments() is more efficient than:
    //
    // const reactions = await Reaction.find(...)
    // reactions.length
    // --------------------------------------------------
    const count = await Reaction.countDocuments({
      postId,
    });

    // Return the total reaction count
    return NextResponse.json({
      count,
    });
  } catch (error) {
    console.error("GET /reactions error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch reactions",
      },
      {
        status: 500,
      }
    );
  }
}