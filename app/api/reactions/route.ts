import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import Reaction from "@/models/Reaction";
import { verifyToken } from "@/lib/auth";

// ======================================================
// TOGGLE REACTION (POST)
// ======================================================
// This endpoint toggles a user's reaction on a post.
// Workflow:
// 
// 1. Receive postId, userId, and reaction type.
// 2. Check whether the reaction already exists.
// 3. If it exists:
//      - Delete it (unlike)
//      - liked = false
// 4. If it does not exist:
//      - Create it (like)
//      - liked = true
// 5. Count total reactions for that post.
// 6. Return:

// {
//    liked: boolean,
//    count: number
// }
// 
// This keeps the frontend synchronized with one request.
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

    // Check if this user has already reacted

    const existingReaction = await Reaction.findOne({
      postId,
      userId,
    });

    let liked = false;

    // If the reaction exists, remove it
    if (existingReaction) {
      await Reaction.deleteOne({
        _id: existingReaction._id,
      });

      liked = false;
    } else {    
      //Otherwise create a new reaction  
      await Reaction.create({
        postId,
        userId,
        type,
      });
        liked = true;
      }
      
      // Count total reactions after the toggle.
      const count = await Reaction.countDocuments({
        postId,
      });
      
      // Return the new state to the frontend.
      return NextResponse.json({
        liked,
        count,
      });
    } catch (error) {
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
// Returns the current number of reactions for a post.
//
// Query:
//
// /api/reactions?postId=123
//  
// Response:
//
// {
//    count: number,
//    liked: boolean
// }
// 
// count
// Total number of reactions for this post.
// 
// liked
// Whether the currently authenticated user has
// already reacted to this post. 
// ======================================================

export async function GET(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    const cookieStore = await cookies();

    const token = cookieStore.get("auth_token")?.value;

    let userId: string | null = null;

    if (token) {
      const payload = verifyToken(token);

      if (payload) {
        userId = payload.userId;
      }
    }

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

    // Check if this user has already reacted

    const existingReaction = await Reaction.findOne({
      postId,
      userId,
    });

    const liked = !!existingReaction;

    // Return the total reaction count
    return NextResponse.json({
      count,
      liked,
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