"use client";

import Link from "next/link";
import { useCartStore, cartItemCount } from "@/lib/cart-store";

export function CartBadge() {
  const items = useCartStore((state) => state.items);
  const count = cartItemCount(items);

  return (
    <Link
      href="/cart"
      className="inline-flex min-h-11 items-center font-technical text-sm text-muted transition-colors hover:text-foreground"
    >
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
