import Image from "next/image";
import type { Colorway } from "@/lib/colorways";

const ACCENT_BG: Record<Colorway["accent"], string> = {
  gold: "bg-gold",
  cobalt: "bg-cobalt",
  solar: "bg-solar",
};

const ACCENT_RGB: Record<Colorway["accent"], string> = {
  gold: "227, 178, 60",
  cobalt: "44, 95, 224",
  solar: "242, 168, 29",
};

export function ProductStage({
  colorway,
  image,
  alt,
  priority = false,
}: {
  colorway: Colorway;
  image: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
      {/* Ambient colorway glow, seated low to suggest a lit stage */}
      <div
        className={`absolute left-1/2 top-[60%] h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[70px] ${ACCENT_BG[colorway.accent]}`}
        aria-hidden
      />

      <Image
        src={image}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="relative z-10 object-contain p-8"
      />

      {/* Vignette burn: crushes the photo's pale studio backdrop into the dark stage */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 46% at center, transparent 0%, var(--void) 78%)",
          mixBlendMode: "multiply",
        }}
        aria-hidden
      />

      {/* Rim glow: sits above the multiply layer so the colorway signal survives the burn */}
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-2xl"
        style={{
          boxShadow: `inset 0 0 90px 6px rgba(${ACCENT_RGB[colorway.accent]}, 0.35)`,
        }}
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 z-30 rounded-2xl ring-1 ring-inset ring-line" />
    </div>
  );
}
