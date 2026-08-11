import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Why Barefoot? — KLΘT NOMAD",
  description:
    "Zero drop, wide toe box, five-toe design, flexible sole, ground feel — why KLΘT NOMAD is built around the natural shape and movement of the foot.",
  alternates: { canonical: "/why-barefoot" },
};

const FEATURES = [
  {
    label: "Zero Drop",
    description: "Heel and forefoot remain at the same level.",
  },
  {
    label: "Wide Toe Box",
    description:
      "Space for the toes to spread and move independently. Also great for medical recovery.",
  },
  {
    label: "Five-Toe Design",
    description:
      "Each toe has its own space, following the anatomy of the foot. Also increases blood flow and circulation to the toes.",
  },
  {
    label: "Flexible Sole",
    description:
      "Designed to bend with the foot and maintain a closer connection with the ground.",
  },
  {
    label: "Ground Feel",
    description:
      "A thinner, flexible platform gives you balance and greater awareness of the surface beneath you.",
  },
];

export default function WhyBarefootPage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-28 pb-24"
      >
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Philosophy
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Why Barefoot?
        </h1>

        <div className="mt-10 flex flex-col gap-1 font-display text-xl text-foreground">
          <p>Less between you and the ground.</p>
          <p>More connection to the journey.</p>
        </div>

        <div className="mt-8 flex flex-col gap-6 text-muted leading-relaxed">
          <p>
            NOMAD isn&rsquo;t about going backward. It&rsquo;s about moving
            naturally forward.
          </p>
        </div>

        <p className="mt-10 font-display text-xl text-gold-ink">
          Your feet were designed to move.
        </p>

        <div className="mt-8 flex flex-col gap-6 text-muted leading-relaxed">
          <p>
            For most of human history, we walked, ran, climbed and travelled
            with our feet close to the ground; feeling the surface beneath us
            and adapting to the terrain.
          </p>
          <p>
            Modern footwear changed that relationship. Thick soles, raised
            heels and narrow toe boxes can place the foot inside a more
            structured environment.
          </p>
          <p className="font-display text-xl text-foreground">
            Barefoot footwear takes a different approach.
          </p>
          <p>
            NOMAD is built around the natural shape and movement of the foot:
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-6 rounded-2xl bg-surface p-6 ring-1 ring-line">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="flex flex-col gap-1 border-b border-line pb-6 last:border-none last:pb-0"
            >
              <p className="font-technical text-sm font-medium tracking-[0.15em] text-gold-ink uppercase">
                {f.label}
              </p>
              <p className="text-sm text-muted leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-line pt-10 text-center">
          <p className="font-display text-lg font-medium tracking-wide">
            KLΘT NOMAD
          </p>
          <p className="mt-2 font-technical text-sm tracking-[0.3em] text-gold-ink uppercase">
            Roam Free.
          </p>
          <Link
            href="/nomad#buy"
            className="mt-8 inline-block rounded-full bg-foreground px-8 py-3 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
          >
            Preorder the Nomad
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
