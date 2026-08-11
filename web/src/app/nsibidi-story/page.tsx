import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Nsibidi: The Language of the Road — KLΘT NOMAD",
  description:
    "Long before telephones and email, Nsibidi let meaning travel with the traveler across the trading roads of the Cross River region. KLΘT NOMAD carries that spirit forward.",
  alternates: { canonical: "/nsibidi-story" },
};

export default function NsibidiStoryPage() {
  return (
    <>
      <Header />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-28 pb-24"
      >
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Origin
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Nsibidi: The Language of the Road
        </h1>

        <div className="mt-10 flex flex-col gap-6 text-muted leading-relaxed">
          <p>
            Long before telephones, emails and instant messages, Africa had
            its own ways of carrying information across great distances.
          </p>
          <p>
            In the 1800s, traders moved constantly through the markets and
            trading routes of West Africa &mdash; particularly southeastern
            Nigeria and the Cross River region &mdash; carrying goods, news
            and agreements between communities that did not always share the
            same spoken language.
          </p>
          <p>
            Among the visual communication systems of the region was Nsibidi;
            a sophisticated system of symbols used by different communities
            to express ideas, relationships, actions and messages.
          </p>
          <p className="font-display text-xl text-foreground">
            For a trader, a mark could carry meaning beyond words.
          </p>
          <p>
            A message could be drawn on the ground, marked on an object, or
            communicated through symbols understood across linguistic
            boundaries. In a world connected by footpaths, rivers and
            markets, meaning could travel with the traveler.
          </p>
          <p className="font-display text-xl text-foreground">
            The road itself became a network of communication.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-1 font-display text-2xl font-medium text-gold-ink">
          <p>The trader moved.</p>
          <p>The message moved.</p>
          <p>The knowledge moved.</p>
        </div>

        <div className="mt-10 flex flex-col gap-6 text-muted leading-relaxed">
          <p className="font-display text-xl text-foreground">
            NOMAD carries that spirit forward.
          </p>
          <p>
            Inspired by the ancient relationship between movement,
            communication and culture, KLΘT NOMAD brings this idea into the
            modern world &mdash; where the journey still connects us, but the
            roads now reach far beyond the markets of yesterday.
          </p>
          <p>From the trading roads of Africa to the roads of the world.</p>
        </div>

        <div className="mt-14 border-t border-line pt-10 text-center">
          <p className="font-display text-lg font-medium tracking-wide">
            KLΘT NOMAD
          </p>
          <p className="mt-2 font-technical text-sm tracking-[0.3em] text-gold-ink uppercase">
            Roam Free.
          </p>
          <Link
            href="/nomad#buy"
            className="mt-8 inline-block rounded-full bg-foreground px-8 py-3 font-technical text-sm font-medium text-void transition-transform hover:scale-105"
          >
            Preorder the Nomad
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
