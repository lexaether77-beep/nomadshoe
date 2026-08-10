import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Preorder Terms — KLΘT NOMAD",
  description:
    "Payment, cancellation, refund, and delivery terms for the KLΘT NOMAD preorder.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
          Preorder Terms
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated August 2026</p>

        <div className="mt-10 flex flex-col gap-8 text-muted leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              What you&rsquo;re ordering
            </h2>
            <p className="mt-2">
              A preorder for the KLΘT NOMAD is a commitment to purchase a pair
              from our first production run. Estimated delivery is{" "}
              <strong className="text-foreground">October 2026</strong>. This
              date is our best estimate, not a guarantee &mdash; we&rsquo;ll
              email you if it changes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Payment
            </h2>
            <p className="mt-2">
              Payments are processed securely by Flutterwave. We charge the
              full preorder amount at checkout &mdash; there is no deposit or
              partial payment option. You can pay in USD, or in NGN converted
              from the USD price at the live exchange rate at the time of
              payment.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Cancellations &amp; refunds
            </h2>
            <p className="mt-2">
              You can cancel your preorder for a{" "}
              <strong className="text-foreground">
                full refund within 10 days
              </strong>{" "}
              of placing it. Email{" "}
              <a
                href="mailto:hello@klotworld.com"
                className="text-gold-ink hover:underline"
              >
                hello@klotworld.com
              </a>{" "}
              with your order reference and we&rsquo;ll process it promptly.
            </p>
            <p className="mt-2">
              After 10 days, preorders are final and non-refundable. Your
              order commits us to production and inventory for the October
              2026 release, so we&rsquo;re not able to offer refunds outside
              this window.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Changing your order
            </h2>
            <p className="mt-2">
              Need a different size or colorway? Email us within the 10-day
              window above and we&rsquo;ll update it. After that, we&rsquo;ll
              do our best to accommodate changes but can&rsquo;t guarantee it
              once production planning is underway.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Shipping &amp; delivery
            </h2>
            <p className="mt-2">
              Shipping is included in the preorder price &mdash; there are no
              additional shipping charges at checkout. We ship to the address
              you provide at checkout. You&rsquo;ll receive an email
              confirmation when your order is placed, and another when it
              ships.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Sizing
            </h2>
            <p className="mt-2">
              NOMAD is a five-toe, zero-drop barefoot shoe sized in EU 35
              &ndash;46. If you&rsquo;re unsure of your size, email us before
              ordering and we&rsquo;ll help you figure it out.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-medium text-foreground">
              Contact
            </h2>
            <p className="mt-2">
              Questions about your preorder?{" "}
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
