export function ShowcaseReel() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-24">
      <div className="mb-8 text-center">
        <p className="font-technical text-xs tracking-[0.35em] text-muted uppercase">
          Field Notes
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
          Engineered in Lagos
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-surface ring-1 ring-line">
        <video
          className="w-full"
          src="/video/nomad-reel.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line" />
      </div>
    </section>
  );
}
