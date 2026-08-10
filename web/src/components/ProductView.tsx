"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { colorways, getColorway, type Colorway, type ColorwaySlug } from "@/lib/colorways";
import { nomadMeta, nomadSizesEU, nomadSpecs } from "@/lib/specs";
import { useCartStore } from "@/lib/cart-store";
import { ProductStage } from "@/components/ProductStage";

const ACCENT_RING: Record<Colorway["accent"], string> = {
  gold: "ring-gold",
  cobalt: "ring-cobalt",
  solar: "ring-solar",
};

const ACCENT_BG: Record<Colorway["accent"], string> = {
  gold: "bg-gold",
  cobalt: "bg-cobalt",
  solar: "bg-solar",
};

type ImageKey = "sideA" | "sideB" | "top" | "sole" | "heel" | "pair";

const IMAGE_KEYS: ImageKey[] = ["sideA", "sideB", "top", "sole", "heel", "pair"];

const IMAGE_LABELS: Record<ImageKey, string> = {
  sideA: "Profile",
  sideB: "Profile B",
  top: "Top",
  sole: "Sole",
  heel: "Heel",
  pair: "Pair",
};

const SWIPE_THRESHOLD_PX = 50;

export function ProductView({
  initialColorwaySlug,
}: {
  initialColorwaySlug: ColorwaySlug;
}) {
  const [colorway, setColorway] = useState<Colorway>(
    getColorway(initialColorwaySlug) ?? colorways[0]
  );
  const [activeImage, setActiveImage] = useState<ImageKey>("sideA");
  const [size, setSize] = useState<number | null>(null);
  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const touchStartX = useRef<number | null>(null);
  const mainCtaRef = useRef<HTMLButtonElement>(null);

  function selectColorway(next: Colorway) {
    if (next.slug === colorway.slug) return;
    setColorway(next);
    setActiveImage("sideA");
  }

  function handleAddToCart() {
    if (size === null) {
      setShowSizePrompt(true);
      setAnnouncement("Please select a size before adding to cart.");
      return;
    }
    addItem(colorway.slug, size);
    setShowSizePrompt(false);
    setJustAdded(true);
    setAnnouncement(`${colorway.name}, EU ${size} added to cart.`);
    window.setTimeout(() => setJustAdded(false), 1600);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

    const currentIndex = IMAGE_KEYS.indexOf(activeImage);
    const nextIndex =
      delta < 0
        ? (currentIndex + 1) % IMAGE_KEYS.length
        : (currentIndex - 1 + IMAGE_KEYS.length) % IMAGE_KEYS.length;
    setActiveImage(IMAGE_KEYS[nextIndex]);
  }

  useEffect(() => {
    let ticking = false;
    function checkPosition() {
      const el = mainCtaRef.current;
      ticking = false;
      if (!el) return;
      // Only show once the button has scrolled above the viewport —
      // not before the user has scrolled down to it in the first place.
      setShowStickyBar(el.getBoundingClientRect().top < 0);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkPosition);
    }
    checkPosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 pb-24 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={colorway.slug}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductStage
              image={colorway.images[activeImage]}
              alt={`KLOT NOMAD, ${colorway.name}, ${IMAGE_LABELS[activeImage]} view`}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Light-wipe flash on colorway change */}
        <AnimatePresence>
          <motion.div
            key={`wipe-${colorway.slug}`}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`pointer-events-none absolute inset-0 rounded-2xl ${ACCENT_BG[colorway.accent]}`}
          />
        </AnimatePresence>

        <div className="mt-4 grid grid-cols-6 gap-2">
          {(Object.keys(IMAGE_LABELS) as ImageKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveImage(key)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-surface ring-1 transition-colors ${
                activeImage === key ? ACCENT_RING[colorway.accent] : "ring-line"
              }`}
              aria-label={IMAGE_LABELS[key]}
              aria-pressed={activeImage === key}
            >
              <Image
                src={colorway.images[key]}
                alt=""
                fill
                sizes="80px"
                className="object-cover opacity-70"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Info panel */}
      <div>
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          {nomadMeta.brand} {nomadMeta.model}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={colorway.slug}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {colorway.name}
            </h1>
            <p className="mt-1 text-muted">{colorway.tagline}</p>
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 font-display text-2xl font-medium">
          ${nomadMeta.priceUSD}
          <span className="ml-2 text-sm font-normal text-muted">
            USD &middot; shipping included &middot; full preorder payment
            &middot; NGN available at checkout
          </span>
        </p>

        {/* Colorway swatches */}
        <div className="mt-8">
          <p className="font-technical text-xs tracking-[0.2em] text-muted uppercase">
            Colorway
          </p>
          <div className="mt-3 flex gap-3">
            {colorways.map((cw) => (
              <button
                key={cw.slug}
                type="button"
                onClick={() => selectColorway(cw)}
                aria-label={cw.name}
                aria-pressed={colorway.slug === cw.slug}
                className={`h-10 w-10 rounded-full ${ACCENT_BG[cw.accent]} ring-2 ring-offset-2 ring-offset-void transition-all ${
                  colorway.slug === cw.slug ? ACCENT_RING[cw.accent] : "ring-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div id="buy" className="mt-8 scroll-mt-24">
          <div className="flex items-baseline justify-between">
            <p className="font-technical text-xs tracking-[0.2em] text-muted uppercase">
              Size (EU) &middot;{" "}
              <Link href="/size-guide" className="text-gold-ink normal-case tracking-normal hover:underline">
                Size Guide
              </Link>
            </p>
            {showSizePrompt && (
              <span className="font-technical text-xs text-solar-ink">
                Select a size
              </span>
            )}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {nomadSizesEU.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSize(s);
                  setShowSizePrompt(false);
                }}
                className={`min-h-11 rounded-lg py-2 font-technical text-sm ring-1 transition-colors ${
                  size === s
                    ? `${ACCENT_BG[colorway.accent]} text-foreground ring-transparent`
                    : "bg-surface text-foreground ring-line hover:ring-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          ref={mainCtaRef}
          type="button"
          onClick={handleAddToCart}
          className="mt-8 w-full rounded-full bg-foreground py-4 font-technical text-sm font-medium text-void transition-transform hover:scale-[1.01]"
        >
          {justAdded ? "Added to Cart" : "Add to Cart"}
        </button>
        <p className="mt-3 text-center font-technical text-xs text-muted">
          Estimated delivery: October 2026 &middot; Full preorder payment
          &middot;{" "}
          <Link href="/terms" className="text-gold-ink hover:underline">
            Preorder terms
          </Link>
        </p>
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>

        {/* Spec sheet */}
        <div className="mt-12 rounded-2xl bg-surface p-6 ring-1 ring-line">
          <p className="font-technical text-xs tracking-[0.3em] text-muted uppercase">
            Specification
          </p>
          <dl className="mt-5 flex flex-col gap-3">
            {nomadSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-0.5 border-b border-line pb-3 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <dt className="font-technical text-sm text-muted">
                  {spec.label}
                </dt>
                <dd className="font-technical text-sm sm:text-right">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>

    {/* Sticky mobile add-to-cart bar */}
    <AnimatePresence>
      {showStickyBar && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-line bg-void/95 px-4 py-3 backdrop-blur-sm sm:hidden"
        >
          <div className="flex-1 truncate font-technical text-sm">
            <span className="font-medium">{colorway.name}</span>
            {size !== null && (
              <span className="text-muted"> &middot; EU {size}</span>
            )}
            <span className="ml-2 text-muted">${nomadMeta.priceUSD}</span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="min-h-11 shrink-0 rounded-full bg-foreground px-6 font-technical text-sm font-medium text-void"
          >
            {justAdded ? "Added" : "Add to Cart"}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
