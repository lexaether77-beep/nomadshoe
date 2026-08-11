"use client";

import { useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";

const GLYPHS = [
  { key: "time", word: "Time", icon: "/images/glyphs/time.jpg" },
  { key: "spirit", word: "Spirit", icon: "/images/glyphs/spirit.jpg" },
  { key: "god", word: "God", icon: "/images/glyphs/god.jpg" },
] as const;

export function NsibidiExplainer() {
  const [active, setActive] = useState<string | null>(null);

  function toggle(key: string) {
    const next = active === key ? null : key;
    setActive(next);
    if (next) track("glyph_explored", { glyph: key });
  }

  return (
    <div className="mt-8">
      <div className="flex gap-4">
        {GLYPHS.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => toggle(g.key)}
            aria-pressed={active === g.key}
            aria-label={`Glyph: ${g.word}`}
            className="flex flex-col items-center gap-2"
          >
            <span
              className={`relative h-20 w-20 overflow-hidden rounded-xl ring-1 transition-all sm:h-24 sm:w-24 ${
                active === g.key ? "ring-2 ring-gold" : "ring-line hover:ring-muted"
              }`}
            >
              <Image src={g.icon} alt="" fill sizes="96px" className="object-cover" />
            </span>
          </button>
        ))}
      </div>

      <p className="mt-5 font-display text-xl">
        <span className={active === "time" ? "text-gold-ink" : "text-muted"}>
          Time
        </span>
        <span className="text-muted"> is the </span>
        <span className={active === "spirit" ? "text-gold-ink" : "text-muted"}>
          Spirit
        </span>
        <span className="text-muted"> of </span>
        <span className={active === "god" ? "text-gold-ink" : "text-muted"}>
          God
        </span>
        <span className="text-muted">.</span>
      </p>
      <p className="mt-2 font-technical text-xs text-muted">
        Tap a glyph to trace it in the phrase.
      </p>
    </div>
  );
}
