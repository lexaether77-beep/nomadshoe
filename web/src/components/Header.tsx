import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-sm">
      <Link
        href="/"
        className="inline-flex min-h-11 items-center font-display text-lg font-bold tracking-tight"
      >
        KLΘT
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/nomad"
          className="inline-flex min-h-11 items-center font-technical text-sm text-muted transition-colors hover:text-foreground"
        >
          Nomad
        </Link>
        <CartBadge />
        <Link
          href="/nomad#buy"
          className="inline-flex min-h-11 items-center rounded-full bg-foreground px-5 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
        >
          Preorder
        </Link>
      </nav>
    </header>
  );
}
