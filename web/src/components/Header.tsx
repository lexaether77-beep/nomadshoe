import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-sm">
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight"
      >
        KLΘT
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/nomad"
          className="font-technical text-sm text-muted transition-colors hover:text-foreground"
        >
          Nomad
        </Link>
        <CartBadge />
        <Link
          href="/nomad"
          className="rounded-full bg-foreground px-5 py-2 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
        >
          Preorder
        </Link>
      </nav>
    </header>
  );
}
