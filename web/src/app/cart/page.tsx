"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductStage } from "@/components/ProductStage";
import { getColorway } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";
import { useCartStore, cartSubtotalUSD } from "@/lib/cart-store";

type DiscountValidation =
  | { valid: true; code: string; priceUSD: number }
  | { valid: false; error: string };

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const appliedDiscount = useCartStore((state) => state.appliedDiscount);
  const setAppliedDiscount = useCartStore((state) => state.setAppliedDiscount);
  const subtotal = cartSubtotalUSD(items, appliedDiscount);
  const fullPriceSubtotal = cartSubtotalUSD(items);
  const unitPrice = appliedDiscount?.priceUSD ?? nomadMeta.priceUSD;

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "loading" | "error">("idle");
  const [codeError, setCodeError] = useState("");

  async function handleApplyCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeStatus("loading");
    setCodeError("");
    try {
      const res = await fetch("/api/discount/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });
      const result: DiscountValidation = await res.json();
      if (result.valid) {
        setAppliedDiscount({ code: result.code, priceUSD: result.priceUSD });
        setCodeStatus("idle");
        setCodeInput("");
        track("discount_applied", { code: result.code });
      } else {
        setCodeStatus("error");
        setCodeError(result.error);
      }
    } catch {
      setCodeStatus("error");
      setCodeError("Something went wrong. Try again.");
    }
  }

  function handleRemoveCode() {
    setAppliedDiscount(null);
    setCodeStatus("idle");
    setCodeError("");
  }

  function handleCheckoutClick() {
    track("checkout_started", { itemCount: items.length, subtotalUSD: subtotal });
  }

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 pt-28 pb-24">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 text-center">
            <p className="text-muted">Your cart is empty.</p>
            <Link
              href="/nomad"
              className="rounded-full bg-foreground px-6 py-3 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
            >
              Shop the Nomad
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-col gap-6">
              {items.map((item) => {
                const colorway = getColorway(item.colorwaySlug);
                if (!colorway) return null;
                return (
                  <div
                    key={`${item.colorwaySlug}-${item.size}`}
                    className="flex gap-4 border-b border-line pb-6"
                  >
                    <div className="w-28 shrink-0">
                      <ProductStage
                        image={colorway.images.sideA}
                        alt={`KLOT NOMAD, ${colorway.name}`}
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="font-display text-lg font-medium">
                          {colorway.name}
                        </p>
                        <p className="text-sm text-muted">
                          EU {item.size} &middot;{" "}
                          {appliedDiscount ? (
                            <>
                              <span className="line-through">
                                ${nomadMeta.priceUSD}
                              </span>{" "}
                              <span className="text-gold-ink">${unitPrice}</span>
                            </>
                          ) : (
                            <>${unitPrice}</>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 rounded-full bg-surface px-3 py-1.5 ring-1 ring-line">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQuantity(
                                item.colorwaySlug,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="font-technical text-lg leading-none text-muted hover:text-foreground"
                          >
                            &minus;
                          </button>
                          <span className="font-technical text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(
                                item.colorwaySlug,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="font-technical text-lg leading-none text-muted hover:text-foreground"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.colorwaySlug, item.size)}
                          className="font-technical text-xs tracking-wide text-muted uppercase hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col gap-3">
              {appliedDiscount ? (
                <div className="flex items-center justify-between rounded-full bg-surface px-4 py-2 ring-1 ring-line">
                  <span className="font-technical text-xs text-gold-ink">
                    Code {appliedDiscount.code} applied
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCode}
                    className="font-technical text-xs text-muted underline decoration-dotted hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCode} className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Discount code"
                    aria-label="Discount code"
                    className="min-h-11 flex-1 rounded-full bg-surface px-4 font-technical text-sm uppercase ring-1 ring-line placeholder:text-muted placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button
                    type="submit"
                    disabled={codeStatus === "loading" || !codeInput.trim()}
                    className="min-h-11 shrink-0 rounded-full bg-surface px-5 font-technical text-sm font-medium ring-1 ring-line transition-colors hover:ring-muted disabled:opacity-60"
                  >
                    {codeStatus === "loading" ? "Checking…" : "Apply"}
                  </button>
                </form>
              )}
              {codeStatus === "error" && (
                <p role="alert" className="font-technical text-xs text-solar-ink">
                  {codeError}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2 rounded-2xl bg-surface p-6 ring-1 ring-line">
              <div className="flex items-baseline justify-between">
                <span className="font-technical text-sm text-muted">
                  Subtotal
                </span>
                <div className="text-right">
                  {appliedDiscount && (
                    <span className="mr-2 font-technical text-sm text-muted line-through">
                      ${fullPriceSubtotal}
                    </span>
                  )}
                  <span className="font-display text-xl font-medium">
                    ${subtotal}
                  </span>
                </div>
              </div>
              <p className="font-technical text-xs text-muted">
                Shipping included. NGN conversion (if selected) calculated at
                checkout.
              </p>
            </div>

            <Link
              href="/checkout"
              onClick={handleCheckoutClick}
              className="mt-6 rounded-full bg-foreground py-4 text-center font-technical text-sm font-medium text-void transition-transform hover:scale-[1.01]"
            >
              Proceed to Checkout
            </Link>
            <p className="mt-4 text-center font-technical text-xs text-muted">
              Full refund within 10 days &middot; Estimated delivery October
              2026 &middot; Questions?{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>
            </p>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
