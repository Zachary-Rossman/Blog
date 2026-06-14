import { posts } from "@/data/posts";

export function getPostById(id: number) {
    return posts.find((post) => post.id === id);
}