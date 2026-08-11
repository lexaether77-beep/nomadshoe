import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Unsubscribed — KLΘT NOMAD",
  robots: { index: false, follow: false },
};

export default function WaitlistUnsubscribedPage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Waitlist
        </p>
        <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          You&rsquo;re unsubscribed
        </h1>
        <p className="mt-4 text-muted leading-relaxed">
          We won&rsquo;t send any more waitlist emails to that address. If
          that was a mistake, you can rejoin any time from the product page.
        </p>
      </main>
      <Footer />
    </>
  );
}
