"use client";

type Post = {
  _id: string;
  title: string;
  category: string;
  author: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      
      {/* Title */}
      <h2 className="text-lg font-semibold mb-2">
        {post.title}
      </h2>

      {/* Meta line */}
      <p className="text-sm text-gray-500 mb-3">
        Posted by <span className="font-medium text-gray-700">{post.author}</span>
        {" "}· {post.category}
      </p>

      {/* Action row (future-proofed) */}
      <div className="flex gap-3 text-sm text-gray-600">
        <button className="hover:text-black transition">
          👍 Like
        </button>

        <button className="hover:text-black transition">
          💬 Comment
        </button>
      </div>
    </div>
  );
}