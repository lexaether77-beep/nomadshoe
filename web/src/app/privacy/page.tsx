import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — KLΘT NOMAD",
  description: "What KLΘT collects, how it's used, and your rights over it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-28 pb-24"
      >
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Legal
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated August 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              What we collect
            </h2>
            <p className="mt-2">
              When you place a preorder, we collect your name, email, phone
              number, shipping address, and order details (colorway, size,
              quantity). We do not collect or store your card details &mdash;
              payments are handled directly by Flutterwave, our payment
              processor.
            </p>
            <p className="mt-2">
              If you join the waitlist instead of ordering, we collect just
              your email address.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              How we use it
            </h2>
            <p className="mt-2">
              To process and fulfill your preorder, send you order and
              shipping confirmation emails, and respond if you contact us. We
              don&rsquo;t use your information for anything beyond that.
            </p>
            <p className="mt-2">
              If you&rsquo;re on the waitlist, we&rsquo;ll email you updates
              about the NOMAD launch. You can unsubscribe or ask us to delete
              your email at any time &mdash; see &ldquo;Your rights&rdquo;
              below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Who we share it with
            </h2>
            <p className="mt-2">
              Flutterwave (to process payment) and Resend (to deliver order
              and waitlist emails). We don&rsquo;t sell your data or share it
              with anyone else.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Where it&rsquo;s stored
            </h2>
            <p className="mt-2">
              Your order information is stored in our database, encrypted in
              transit. Access is limited to KLΘT.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Cookies &amp; tracking
            </h2>
            <p className="mt-2">
              Your shopping cart is stored locally in your browser and never
              leaves your device until you check out. We use Vercel Web
              Analytics to see aggregate page-view and conversion trends
              &mdash; it doesn&rsquo;t use cookies and doesn&rsquo;t track you
              individually or across other sites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Your rights
            </h2>
            <p className="mt-2">
              You can request a copy of the data we hold about you, or ask us
              to delete it, at any time by emailing{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Contact
            </h2>
            <p className="mt-2">
              Questions about this policy?{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
