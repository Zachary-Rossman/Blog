type HeroProps = {
  title: string;
  description: string;
};

export default function Hero({ title, description }: HeroProps) {
  return (
    <section
      aria-labelledby="hero-title"
      className="space-y-2"
    >
      <h1
        id="hero-title"
        className="text-3xl font-bold"
      >
        {title}
      </h1>

      <p className="text-gray-600">
        {description}
      </p>
    </section>
  );
}