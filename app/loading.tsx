export default function Loading() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      
      {/* Hero skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 w-1/2 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 w-2/3 rounded animate-pulse" />
      </div>

      {/* Section title */}
      <div className="h-6 bg-gray-200 w-1/4 rounded animate-pulse" />

      {/* Post skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border p-4 rounded animate-pulse space-y-3"
          >
            <div className="h-5 bg-gray-200 w-3/4 rounded" />
            <div className="h-3 bg-gray-200 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </main>
  );
}