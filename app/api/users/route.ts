import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET() {
  await connectDB();

  const users = await User.find()

  return NextResponse.json(users);
}

  export async function POST(request: Request) {
    try {
      // 1. Connect to DB
      await connectDB();

      // 2. Get data from request body
      const body = await request.json();

      const {
        firstName,
        lastName,
        birthday,
        username,
        email,
        password,
      } = body;

      // 3. Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email },
          { username }
        ]
      });
        
      if (existingUser) {
        return Response.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
        
      // 4. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
        
      // 5. Create user
      const newUser = await User.create({
        firstName,
        lastName,
        birthday,
        username,
        email,
        password: hashedPassword,
      });
        
      // 6. Return success (DON'T send password back)
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
        { status: 201 }
      );
    
    } catch (error) {
      console.error(error);

      return Response.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }
  }