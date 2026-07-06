import Link from "next/link";

/**
 * ============================================================
 * HERO COMPONENT
 * ============================================================
 *
 * The Hero component serves as the introduction section for a page.
 *
 * Responsibilities:
 *
 * • Display the page's primary title.
 * • Display a short supporting description.
 * • Give users clear calls-to-action.
 * • Create visual hierarchy at the top of the page.
 *
 * This component is intentionally reusable.
 * Any page can provide a different title and description while
 * keeping the same layout and styling.
 */

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
      {/* ========================================================
          DECORATIVE BACKGROUND
      ===========================================================
          This blurred circle adds visual depth without affecting
          the content itself.

          Because it is purely decorative, it does not need any
          accessibility attributes.
      */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-100 blur-3xl opacity-40" />

      {/* ========================================================
          HERO CONTENT
      ===========================================================
          Contains the page heading, description, and primary
          navigation buttons.

          The "relative" positioning ensures this content appears
          above the decorative background.
      */}
      <div className="relative max-w-3xl space-y-6">

        {/* SMALL HEADING */}
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          Full Stack Blog
        </p>

        {/* MAIN PAGE TITLE */}
        <h1
          id="hero-title"
          className="text-5xl font-bold tracking-tight text-gray-900"
        >
          {title}
        </h1>

        {/* SUPPORTING DESCRIPTION */}
        <p className="text-lg leading-8 text-gray-600">
          {description}
        </p>

        {/* ====================================================
            CALL TO ACTION BUTTONS
        =======================================================
            These buttons encourage users toward the two most
            common actions:
              • Browse existing content.
              • Create an account.
        */}
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