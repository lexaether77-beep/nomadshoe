"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductStage } from "@/components/ProductStage";
import { getColorway } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";
import { useCartStore, cartSubtotalUSD } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = cartSubtotalUSD(items);

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
                          EU {item.size} &middot; ${nomadMeta.priceUSD}
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

            <div className="mt-10 flex flex-col gap-2 rounded-2xl bg-surface p-6 ring-1 ring-line">
              <div className="flex items-baseline justify-between">
                <span className="font-technical text-sm text-muted">
                  Subtotal
                </span>
                <span className="font-display text-xl font-medium">
                  ${subtotal}
                </span>
              </div>
              <p className="font-technical text-xs text-muted">
                Shipping included. NGN conversion (if selected) calculated at
                checkout.
              </p>
            </div>

            <Link
              href="/checkout"
              className="mt-6 rounded-full bg-foreground py-4 text-center font-technical text-sm font-medium text-void transition-transform hover:scale-[1.01]"
            >
              Proceed to Checkout
            </Link>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
