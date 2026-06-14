type PostCardProps = {
    title: string,
    author: string;
};

export default function PostCard({
    title,
    author,
}: PostCardProps) {
    return (
        <article className="bg-cyan-300 border">
            <h2>{title}</h2>
            <p>By {author}</p>
        </article>
    )
}