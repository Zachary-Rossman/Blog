import Link from "next/link";

type HeroProps = {
  title: string;
  description: string;
};

export default function Hero({
  title,
  description,
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-gray-50 px-10 py-20 shadow-sm"
    >
      {/* Decorative background */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-40" />

      <div className="relative max-w-3xl space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          Full Stack Blog
        </p>

        <h1
          id="hero-title"
          className="text-5xl font-bold tracking-tight text-gray-900"
        >
          {title}
        </h1>

        <p className="text-lg leading-8 text-gray-600">
          {description}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/posts"
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Browse Posts
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Join Community
          </Link>
        </div>
      </div>
    </section>
  );
}