"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { recommendSize } from "@/lib/size-calculator";

export function FootSizeCalculator() {
  const [cm, setCm] = useState("");
  const [result, setResult] = useState<ReturnType<typeof recommendSize> | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = parseFloat(cm);
    if (Number.isNaN(value) || value <= 0) return;
    const rec = recommendSize(value);
    setResult(rec);
    track("size_calculated", {
      cm: value,
      result: rec.status === "ok" ? rec.size : rec.status,
    });
  }

  return (
    <div className="mt-8 rounded-2xl bg-surface p-6 ring-1 ring-line">
      <p className="font-technical text-xs tracking-[0.3em] text-muted uppercase">
        Find My Size
      </p>
      <p className="mt-2 text-sm text-muted leading-relaxed">
        Measure your foot length from heel to the tip of your longest toe, in
        centimetres, and we&rsquo;ll match it to a NOMAD size.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="1"
          required
          value={cm}
          onChange={(e) => {
            setCm(e.target.value);
            setResult(null);
          }}
          placeholder="Foot length in cm, e.g. 26.2"
          aria-label="Foot length in centimetres"
          className="min-h-11 flex-1 rounded-full bg-void px-4 font-technical text-sm ring-1 ring-line placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
        />
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-full bg-foreground px-6 font-technical text-sm font-medium text-void transition-transform hover:scale-[1.01]"
        >
          Find My Size
        </button>
      </form>

      {result && (
        <div role="status" className="mt-4 font-technical text-sm">
          {result.status === "ok" && (
            <p>
              Your size:{" "}
              <span className="text-gold-ink font-medium">
                EU {result.size}
              </span>
              {result.betweenSizes && (
                <span className="text-muted">
                  {" "}
                  &mdash; you&rsquo;re between sizes, we sized you down for
                  the best fit.
                </span>
              )}
            </p>
          )}
          {result.status === "too-small" && (
            <p className="text-muted">
              That&rsquo;s smaller than our smallest mold (35/36). Email{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>{" "}
              and we&rsquo;ll help you figure out fit.
            </p>
          )}
          {result.status === "too-large" && (
            <p className="text-muted">
              That&rsquo;s larger than our largest mold (44/45). Email{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>{" "}
              and we&rsquo;ll help you figure out fit.
            </p>
          )}
          {result.status === "ok" && (
            <Link
              href="/nomad#buy"
              className="mt-3 inline-block text-xs text-gold-ink hover:underline"
            >
              Shop the Nomad &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
