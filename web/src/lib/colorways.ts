export type ColorwaySlug = "obsidian" | "cobalt-current" | "solar";

export type Colorway = {
  slug: ColorwaySlug;
  name: string;
  tagline: string;
  /** Tailwind token suffix, e.g. "gold" -> bg-gold, text-gold, etc. */
  accent: "gold" | "cobalt" | "solar";
  accentGlowVar: string;
  /** Tailwind bg class for the colorway swatch — the shoe's actual body color. */
  swatchClass: string;
  images: {
    top: string;
    sole: string;
    heel: string;
    sideA: string;
    sideB: string;
    pair: string;
  };
};

const imagesFor = (slug: ColorwaySlug) => ({
  top: `/images/nomad/${slug}/top.jpg`,
  sole: `/images/nomad/${slug}/sole.jpg`,
  heel: `/images/nomad/${slug}/heel.jpg`,
  sideA: `/images/nomad/${slug}/side-a.jpg`,
  sideB: `/images/nomad/${slug}/side-b.jpg`,
  pair: `/images/nomad/${slug}/pair.jpg`,
});

export const colorways: Colorway[] = [
  {
    slug: "obsidian",
    name: "Obsidian",
    tagline: "Gold-etched, night-forged",
    accent: "gold",
    accentGlowVar: "var(--gold-glow)",
    swatchClass: "bg-foreground",
    images: imagesFor("obsidian"),
  },
  {
    slug: "cobalt-current",
    name: "Cobalt Current",
    tagline: "Deep signal, ember toe",
    accent: "cobalt",
    accentGlowVar: "var(--cobalt-glow)",
    swatchClass: "bg-cobalt",
    images: imagesFor("cobalt-current"),
  },
  {
    slug: "solar",
    name: "Solar",
    tagline: "High-noon, verdant edge",
    accent: "solar",
    accentGlowVar: "var(--solar-glow)",
    swatchClass: "bg-solar",
    images: imagesFor("solar"),
  },
];

export function getColorway(slug: string): Colorway | undefined {
  return colorways.find((c) => c.slug === slug);
}
