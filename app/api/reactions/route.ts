import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import Reaction from "@/models/Reaction";
import { verifyToken } from "@/lib/auth";

// ======================================================
// TOGGLE REACTION (POST)
// ======================================================
//
// This endpoint is responsible for handling the "Like"
// button on an individual post.
//
// Rather than having separate Like and Unlike endpoints,
// this route simply toggles the reaction:
//
// • If the user has already liked the post,
//   remove the reaction.
//
// • If the user has not liked the post,
//   create a new reaction.
//
// The frontend only needs one request because this route
// returns BOTH:
//
// {
//   liked: boolean,
//   count: number
// }
//
// liked
//   Whether the current user now likes the post.
//
// count
//   The updated total number of reactions.
//
// ======================================================

export async function POST(req: Request) {
  try {
    // --------------------------------------------------
    // Step 1
    // Connect to MongoDB.
    // --------------------------------------------------
    await connectDB();

    // --------------------------------------------------
    // Step 2
    // Read the request body sent by the frontend.
    // --------------------------------------------------
    const body = await req.json();

    const { postId, userId, type } = body;

    // --------------------------------------------------
    // Step 3
    // Validate required values.
    //
    // Every reaction must belong to:
    //
    // • a post
    // • a user
    // • a reaction type
    // --------------------------------------------------
    if (!postId || !userId || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // Step 4
    // Determine whether this user has already reacted.
    //
    // Only one reaction per user per post is allowed.
    // --------------------------------------------------
    const existingReaction = await Reaction.findOne({
      postId,
      userId,
    });

    let liked = false;

    // --------------------------------------------------
    // Step 5
    // Toggle the reaction.
    // --------------------------------------------------

    if (existingReaction) {
      // User already liked the post.
      // Remove the reaction.
      await Reaction.deleteOne({
        _id: existingReaction._id,
      });

      liked = false;
    } else {
      // User has not liked the post.
      // Create a new reaction.
      await Reaction.create({
        postId,
        userId,
        type,
      });

      liked = true;
    }

    // --------------------------------------------------
    // Step 6
    // Count every reaction currently attached to
    // this post.
    //
    // countDocuments() is efficient because MongoDB
    // performs the count without returning every
    // document.
    // --------------------------------------------------
    const count = await Reaction.countDocuments({
      postId,
    });

    // --------------------------------------------------
    // Step 7
    // Return the updated state so the React component
    // can immediately update its UI.
    // --------------------------------------------------
    return NextResponse.json({
      liked,
      count,
    });
  } catch (error) {
    // Server-side logging is useful for diagnosing
    // unexpected production issues.
    console.error("POST /reactions error:", error);

    return NextResponse.json(
      {
        error: "Failed to toggle reaction",
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
//
// Returns the information necessary to render the
// reaction button when a post page first loads.
//
// Example:
//
// GET /api/reactions?postId=123
//
// Response:
//
// {
//   count: number,
//   liked: boolean
// }
//
// count
//   Total number of reactions on this post.
//
// liked
//   Whether the CURRENT authenticated user has already
//   reacted to this post.
//
// This allows the page to immediately display:
//
// ❤️  if already liked
//
// 🤍  if not yet liked
//
// without waiting for another client action.
//
// ======================================================

export async function GET(req: Request) {
  try {
    // --------------------------------------------------
    // Step 1
    // Connect to MongoDB.
    // --------------------------------------------------
    await connectDB();

    // --------------------------------------------------
    // Step 2
    // Read the authentication cookie.
    //
    // If a user is logged in we can determine whether
    // THEY specifically have already liked this post.
    // --------------------------------------------------
    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    let userId: string | null = null;

    if (token) {
      const payload = verifyToken(token);

      if (payload) {
        userId = payload.userId;
      }
    }

    // --------------------------------------------------
    // Step 3
    // Read the requested post ID from the query string.
    // --------------------------------------------------
    const { searchParams } = new URL(req.url);

    const postId = searchParams.get("postId");

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
    // Step 4
    // Count every reaction on the post.
    // --------------------------------------------------
    const count = await Reaction.countDocuments({
      postId,
    });

    // --------------------------------------------------
    // Step 5
    // Check whether THIS authenticated user has already
    // reacted.
    //
    // If userId is null (guest visitor), this query
    // naturally returns null.
    // --------------------------------------------------
    const existingReaction = await Reaction.findOne({
      postId,
      userId,
    });

    const liked = !!existingReaction;

    // --------------------------------------------------
    // Step 6
    // Return the data needed to initialize the reaction
    // button.
    // --------------------------------------------------
    return NextResponse.json({
      count,
      liked,
    });
  } catch (error) {
    // Server-side logging is useful for diagnosing
    // unexpected production issues.
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