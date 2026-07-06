import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

// =====================================================
// GET USERS
// =====================================================
//
// Returns every user currently stored in the database.
//
// This route exists primarily for development/testing.
// In a production application you would almost never
// expose every user like this without authentication
// and authorization.
//
// Flow:
//
// 1. Connect to MongoDB.
// 2. Query every User document.
// 3. Return the array as JSON.
//
// =====================================================

export async function GET() {
  await connectDB();

  const users = await User.find();

  return NextResponse.json(users);
}

// =====================================================
// CREATE USER (REGISTER)
// =====================================================
//
// Creates a brand new user account.
//
// Registration flow:
//
// 1. Connect to MongoDB.
// 2. Read the submitted form data.
// 3. Check if the email OR username already exists.
// 4. Hash the user's password using bcrypt.
// 5. Create the new user document.
// 6. Return a success response without exposing
//    the user's password.
//
// Passwords are NEVER stored in plain text.
// Instead, bcrypt creates a one-way hash that is
// impossible to reverse. During login, bcrypt compares
// the submitted password against the stored hash.
//
// =====================================================

export async function POST(request: Request) {
  try {
    // -------------------------------------------------
    // Step 1
    // Connect to MongoDB.
    //
    // connectDB() safely reuses the existing connection
    // if one already exists.
    // -------------------------------------------------
    await connectDB();

    // -------------------------------------------------
    // Step 2
    // Read the JSON body sent from the registration form.
    // -------------------------------------------------
    const body = await request.json();

    const {
      firstName,
      lastName,
      birthday,
      username,
      email,
      password,
    } = body;

    // -------------------------------------------------
    // Step 3
    // Prevent duplicate accounts.
    //
    // A user should not be able to register with an
    // email or username that already exists.
    //
    // The $or operator tells MongoDB:
    //
    // Find a document where:
    //   email matches
    //      OR
    //   username matches
    // -------------------------------------------------
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username },
      ],
    });

    if (existingUser) {
      return Response.json(
        {
          error: "User already exists",
        },
        {
          status: 400,
        }
      );
    }

    // -------------------------------------------------
    // Step 4
    // Hash the password.
    //
    // bcrypt.hash(password, 10)
    //
    // The second argument is the salt rounds.
    // More rounds increase security but also require
    // more processing time.
    //
    // 10 rounds is a common production default.
    // -------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -------------------------------------------------
    // Step 5
    // Create the new user document.
    //
    // Notice that we store the hashed password instead
    // of the original password.
    // -------------------------------------------------
    const newUser = await User.create({
      firstName,
      lastName,
      birthday,
      username,
      email,
      password: hashedPassword,
    });

    // -------------------------------------------------
    // Step 6
    // Return a success response.
    //
    // Never send the password back to the client,
    // even if it is hashed.
    // -------------------------------------------------
    return Response.json(
      {
        message: "User created successfully",
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lstName,
          email: newUser.email,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    // -------------------------------------------------
    // If anything unexpected happens (database issues,
    // malformed request, etc.), log the error on the
    // server and return a generic message to the client.
    //
    // We intentionally do not expose internal error
    // details to the browser.
    // -------------------------------------------------
    console.error("POST /users error:", error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}