import { nomadSpecs } from "@/lib/specs";
import { NsibidiExplainer } from "@/components/NsibidiExplainer";

export function BrandStory() {
  return (
    <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Origin
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Victory Through Harmony
        </h2>
        <p className="mt-6 text-muted leading-relaxed">
          The NOMAD is designed to mimic the natural shape and movement of
          the foot &mdash; a five-toe, zero-drop shoe built for maximum
          ground feedback, balance, and comfort. Every pair carries three
          symbols inspired by Nsibidi, an ideographic script native to
          southeastern Nigeria.
        </p>

        <NsibidiExplainer />

        <p className="mt-8 text-muted leading-relaxed">
          Designed in Lagos. Built for the ground beneath you, wherever that
          ground happens to be.
        </p>
      </div>

      <div className="rounded-2xl bg-surface p-8 ring-1 ring-line">
        <p className="font-technical text-xs tracking-[0.3em] text-muted uppercase">
          Specification
        </p>
        <dl className="mt-6 flex flex-col gap-4">
          {nomadSpecs.map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col gap-0.5 border-b border-line pb-3 last:border-none last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
            >
              <dt className="font-technical text-sm text-muted">
                {spec.label}
              </dt>
              <dd className="font-technical text-sm sm:text-right">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
