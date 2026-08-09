"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getColorway } from "@/lib/colorways";
import { useCartStore } from "@/lib/cart-store";

type OrderItem = {
  colorwaySlug: string;
  size: number;
  quantity: number;
};

type Status = "PENDING" | "PAID" | "FAILED";

export function OrderConfirmation({
  reference,
  initialStatus,
  items,
  currency,
  amount,
  fullName,
}: {
  reference: string;
  initialStatus: Status;
  items: OrderItem[];
  currency: string;
  amount: number;
  fullName: string;
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const clearCart = useCartStore((state) => state.clear);

  useEffect(() => {
    if (status !== "PENDING") return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await fetch(`/api/orders/${reference}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const body = (await res.json()) as { status: Status };
          if (body.status !== "PENDING") {
            setStatus(body.status);
            clearInterval(interval);
          }
        }
      } catch {
        // keep polling; a transient failure isn't worth surfacing
      }
      if (attempts >= 20) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [status, reference]);

  useEffect(() => {
    if (status === "PAID") clearCart();
  }, [status, clearCart]);

  return (
    <section className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85, filter: "blur(14px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          boxShadow:
            status === "PAID"
              ? "0 0 60px 10px rgba(227, 178, 60, 0.35)"
              : "0 0 0px 0px rgba(227, 178, 60, 0)",
        }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-32 w-32 overflow-hidden rounded-xl"
      >
        <Image
          src="/images/brand/mark.jpg"
          alt="KLΘT mark"
          fill
          sizes="128px"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at center, transparent 0%, var(--void) 92%)",
            mixBlendMode: "multiply",
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-8"
      >
        {status === "PAID" && (
          <>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Preorder Confirmed
            </h1>
            <p className="mt-3 max-w-md text-muted">
              Victory Through Harmony, {fullName}. Your NOMAD is reserved for
              the October 2026 release &mdash; a confirmation has been sent
              to your email.
            </p>
          </>
        )}
        {status === "PENDING" && (
          <>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Confirming Payment&hellip;
            </h1>
            <p className="mt-3 max-w-md text-muted">
              This usually takes a few seconds. Don&rsquo;t close this page.
            </p>
          </>
        )}
        {status === "FAILED" && (
          <>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Payment Didn&rsquo;t Go Through
            </h1>
            <p className="mt-3 max-w-md text-muted">
              Your card wasn&rsquo;t charged. You can try again from your
              cart.
            </p>
            <Link
              href="/checkout"
              className="mt-6 inline-block rounded-full bg-gold px-8 py-3 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
            >
              Try Again
            </Link>
          </>
        )}

        <div className="mt-10 rounded-2xl bg-surface p-6 text-left ring-1 ring-line">
          <p className="font-technical text-xs tracking-[0.3em] text-muted uppercase">
            Reference
          </p>
          <p className="mt-1 font-technical text-sm">{reference}</p>

          <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
            {items.map((item) => {
              const colorway = getColorway(item.colorwaySlug);
              return (
                <div
                  key={`${item.colorwaySlug}-${item.size}`}
                  className="flex items-baseline justify-between text-sm"
                >
                  <span>
                    {item.quantity} &times; {colorway?.name ?? item.colorwaySlug}{" "}
                    (EU {item.size})
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-technical text-sm text-muted">Total</span>
            <span className="font-display text-lg font-medium">
              {currency} {amount}
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block font-technical text-sm text-muted hover:text-foreground"
        >
          Back to KLΘT
        </Link>
      </motion.div>
    </section>
  );
}
