import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

/**
 * ======================================================
 * GET ALL POSTS
 * ======================================================
 *
 * Shared database function.
 *
 * Used by:
 *
 * • Homepage
 * • Posts page
 * • API routes
 *
 * This prevents duplicating database logic across
 * multiple files.
 * ======================================================
 */

export async function getPosts() {
  await connectDB();

  const posts = await Post.find().sort({
    createdAt: -1,
  });

  return posts;
}

/**
 * ======================================================
 * GET SINGLE POST
 * ======================================================
 */

export async function getPost(id: string) {
  await connectDB();

  return await Post.findById(id);
}