import Link from "next/link";
import { colorways } from "@/lib/colorways";
import { ProductStage } from "@/components/ProductStage";

export function ColorwayTeaser() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Three Signals
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Choose Your Colorway
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {colorways.map((cw) => (
          <Link
            key={cw.slug}
            href={`/nomad?color=${cw.slug}`}
            className="group flex flex-col gap-3"
          >
            <div className="transition-transform duration-500 group-hover:scale-[1.02]">
              <ProductStage
                colorway={cw}
                image={cw.images.sideA}
                alt={`KLOT NOMAD, ${cw.name} colorway`}
              />
            </div>
            <div className="text-center">
              <p className="font-display text-lg font-medium">{cw.name}</p>
              <p className="text-sm text-muted">{cw.tagline}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
