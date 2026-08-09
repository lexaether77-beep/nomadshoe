"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getColorway } from "@/lib/colorways";
import { nomadMeta } from "@/lib/specs";
import { useCartStore, cartSubtotalUSD } from "@/lib/cart-store";
import { createOrder, type CheckoutState } from "@/lib/actions";

const inputClass =
  "w-full rounded-lg bg-surface px-4 py-3 text-sm ring-1 ring-line placeholder:text-muted focus:outline-none focus:ring-foreground";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = cartSubtotalUSD(items);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    createOrder,
    null
  );

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 pt-28 pb-24">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Checkout
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
          <form
            action={formAction}
            className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr]"
          >
            <input
              type="hidden"
              name="cartItems"
              value={JSON.stringify(items)}
            />
            <input type="hidden" name="currency" value={currency} />

            <div className="flex flex-col gap-4">
              <p
                id="checkout-heading"
                className="font-technical text-xs tracking-[0.2em] text-muted uppercase"
              >
                Contact &amp; Shipping
              </p>

              <label htmlFor="fullName" className="sr-only">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                placeholder="Full name"
                autoComplete="name"
                required
                className={inputClass}
              />

              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                required
                className={inputClass}
              />

              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Phone number"
                autoComplete="tel"
                required
                className={inputClass}
              />

              <label htmlFor="address" className="sr-only">
                Shipping address
              </label>
              <input
                id="address"
                name="address"
                placeholder="Shipping address"
                autoComplete="street-address"
                required
                className={inputClass}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="sr-only">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    placeholder="City"
                    autoComplete="address-level2"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="country" className="sr-only">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    placeholder="Country"
                    autoComplete="country-name"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <p className="mt-4 font-technical text-xs tracking-[0.2em] text-muted uppercase">
                Currency
              </p>
              <div className="flex gap-3">
                {(["USD", "NGN"] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`flex-1 rounded-lg py-3 font-technical text-sm ring-1 transition-colors ${
                      currency === c
                        ? "bg-foreground text-void ring-transparent"
                        : "bg-surface text-foreground ring-line hover:ring-muted"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {currency === "NGN" && (
                <p className="font-technical text-xs text-muted">
                  Charged in Naira at the live USD/NGN rate when you submit.
                </p>
              )}

              {state?.error && (
                <p
                  role="alert"
                  aria-live="polite"
                  className="font-technical text-sm text-solar"
                >
                  {state.error}
                </p>
              )}

              <button
                type="submit"
                disabled={pending}
                className="mt-4 rounded-full bg-gold py-4 font-technical text-sm font-medium text-void transition-transform hover:scale-[1.01] disabled:opacity-60"
              >
                {pending ? "Starting payment…" : "Pay with Flutterwave"}
              </button>
            </div>

            <div className="h-fit rounded-2xl bg-surface p-6 ring-1 ring-line">
              <p className="font-technical text-xs tracking-[0.3em] text-muted uppercase">
                Order Summary
              </p>
              <div className="mt-5 flex flex-col gap-3">
                {items.map((item) => {
                  const colorway = getColorway(item.colorwaySlug);
                  return (
                    <div
                      key={`${item.colorwaySlug}-${item.size}`}
                      className="flex items-baseline justify-between text-sm"
                    >
                      <span>
                        {item.quantity} &times; {colorway?.name} (EU{" "}
                        {item.size})
                      </span>
                      <span className="font-technical">
                        ${item.quantity * nomadMeta.priceUSD}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                <span className="font-technical text-sm text-muted">
                  Subtotal
                </span>
                <span className="font-display text-xl font-medium">
                  ${subtotal}
                </span>
              </div>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
