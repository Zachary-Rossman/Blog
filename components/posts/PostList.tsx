import type { Post } from "@/types/post";
import PostCard from "./PostCard";

type PostListProps = {
    posts: Post[];
};

export default function PostList({
    posts,
}: PostListProps) {
    return (
        <div className="flex flex-wrap gap-4">
            {posts.map((post) => (
                <PostCard
                key={post.id}
                post={post}
                />
            ))}
        </div>
    );
}