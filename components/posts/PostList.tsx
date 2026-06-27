import PostCard from "./PostCard";

type Post = {
  _id: string;
  title: string;
  category: string;
  author: string;
  imageUrl: string;
};

export default function PostList({
  posts,
  loading = false,
}: {
  posts?: Post[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostCard key={i} loading />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}