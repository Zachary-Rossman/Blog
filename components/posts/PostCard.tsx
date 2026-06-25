"use client";

type Post = {
  _id: string;
  title: string;
  category: string;
  author: string;
};

export default function PostCard({
  post,
  loading = false,
}: {
  post?: Post;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="border rounded-lg p-4 animate-pulse space-y-3">
        <div className="h-5 bg-gray-200 w-3/4 rounded" />
        <div className="h-3 bg-gray-200 w-1/2 rounded" />
        <div className="flex gap-3 mt-3">
          <div className="h-3 bg-gray-200 w-10 rounded" />
          <div className="h-3 bg-gray-200 w-16 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
      <h2 className="text-lg font-semibold mb-2">
        {post!.title}
      </h2>

      <p className="text-sm text-gray-500 mb-3">
        Posted by{" "}
        <span className="font-medium text-gray-700">
          {post!.author}
        </span>{" "}
        · {post!.category}
      </p>
    </div>
  );
}