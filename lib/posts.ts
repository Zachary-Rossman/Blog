import { posts as initialPosts } from "@/data/posts";
import type { Post } from "@/types/post";

// In-memory "database"
let posts: Post[] = [...initialPosts];

export function getAllPosts() {
  return posts;
}

export function getPostById(id: number) {
  return posts.find((post) => post.id === id);
}

export function createPost(newPost: Post) {
  posts = [newPost, ...posts];
  return newPost;
}