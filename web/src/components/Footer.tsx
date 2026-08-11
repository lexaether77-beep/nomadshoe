import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 text-center">
        <p className="font-display text-sm font-medium tracking-wide">
          KLΘT
        </p>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-technical text-xs tracking-wide text-muted uppercase">
          <a
            href="https://klotworld.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            KLΘT Worx
          </a>
          <a
            href="https://instagram.com/klotworld"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground"
          >
            @klotworld
          </a>
          <a
            href="mailto:hello@klotworld.com"
            className="hover:text-foreground"
          >
            hello@klotworld.com
          </a>
          <Link href="/nsibidi-story" className="hover:text-foreground">
            The Nsibidi Story
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Preorder Terms
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
        </nav>

        <p className="font-technical text-xs tracking-[0.2em] text-muted uppercase">
          Victory Through Harmony &middot; Lagos, Nigeria
        </p>
      </div>
    </footer>
  );
}
