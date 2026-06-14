import Button from "@/components/ui/Button";
import Hero from "@/components/layout/Hero";

export default function Home() {
  return (
    <>
      <Hero
        title="Welcome to Blog"
        description="A full-stack blog application built with Next.js."
      />

      <Button text="Read Posts" />

      <Button
        text="Disabled Button"
        disabled={true}
      />
    </>
  );
}