import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ShowcaseReel } from "@/components/ShowcaseReel";
import { BrandStory } from "@/components/BrandStory";
import { ColorwayTeaser } from "@/components/ColorwayTeaser";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <ShowcaseReel />
        <BrandStory />
        <ColorwayTeaser />
      </main>
      <Footer />
    </>
  );
}
