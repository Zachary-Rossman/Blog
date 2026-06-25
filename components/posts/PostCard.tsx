import type { Post } from "@/types/post"

type PostCardProps = {
    post: Post,
};

export default function PostCard({
    post,
}: PostCardProps) {
    return (
        <article className="bg-cyan-300 border">
            <h2>{post.title}</h2>

            <p>{post.likes} likes</p>

            <p>{post.comments} comments</p>

            <p>Category: {post.category}</p>

            <p>Published: {post.publishedDate}</p>
        </article>
    )
}