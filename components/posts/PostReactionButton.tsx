"use client";

type PostReactionButtonProps = {
  liked: boolean;
  count: number;
  loading?: boolean;
  onClick: () => void;
};

export default function PostReactionButton({
  liked,
  count,
  loading = false,
  onClick,
}: PostReactionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-pressed={liked}
      aria-label={liked ? "Remove like" : "Like this post"}
      className={`
        inline-flex items-center gap-2
        rounded-lg
        border
        px-4
        py-2
        text-sm
        font-medium
        transition
        focus:outline-none
        focus:ring-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          liked
            ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }
      `}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <span aria-hidden="true">
          {liked ? "❤️" : "🤍"}
        </span>
      )}

      <span>{count}</span>
    </button>
  );
}