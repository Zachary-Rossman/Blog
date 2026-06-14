type PostCardProps = {
    title: string,
    author: string;
    likes: number;
    comments: number;
};

export default function PostCard({
    title,
    author,
    likes,
    comments
}: PostCardProps) {
    return (
        <article className="bg-cyan-300 border">
            <h2>{title}</h2>

            <p>By {author}</p>

            <p>{likes} likes</p>

            <p>{comments}</p>
        </article>
    )
}