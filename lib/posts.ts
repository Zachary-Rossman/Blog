import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types/Post";

// ======================================================
// IN-MEMORY DATA STORE (DEV ONLY)
// ======================================================
//
// This file acts as a temporary "database layer".
// It is NOT persistent — meaning:
// - Data resets on server restart
// - It is only safe for learning / prototyping
//
// In a real production app, this would be replaced with:
// - MongoDB queries (Mongoose)
// - Prisma ORM calls
// - Or API requests to a backend service
// ======================================================

// Clone initial data into mutable state
let posts: Post[] = [...initialPosts];

// ======================================================
// GET ALL POSTS
// ======================================================
//
// Returns full list of posts from memory.
// Used for:
// - homepage feed
// - posts listing page
//
// In production this would become:
// GET /api/posts or database query
// ======================================================
export function getAllPosts() {
  return posts;
}

// ======================================================
// GET SINGLE POST BY ID
// ======================================================
//
// Finds one post by its ID.
//
// IMPORTANT NOTE:
// - This assumes ID is numeric (Post.id is number)
// - In MongoDB this would become:
//   post._id (string ObjectId)
//
// Used for:
// - individual post pages (/posts/[id])
// ======================================================
export function getPostById(id: number) {
  return posts.find((post) => post.id === id);
}

// ======================================================
// CREATE POST
// ======================================================
//
// Adds a new post to the beginning of the array.
//
// Behavior:
// - New posts appear at top (latest-first ordering)
// - Mutates in-memory array
//
// In production this would become:
// - POST /api/posts
// - MongoDB insertOne / Mongoose create()
// ======================================================
export function createPost(newPost: Post) {
  posts = [newPost, ...posts];
  return newPost;
}