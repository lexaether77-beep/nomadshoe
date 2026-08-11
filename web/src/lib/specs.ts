export const nomadSpecs = [
  { label: "Heel Drop", value: "0mm (Zero Drop)" },
  { label: "Weight", value: "180–230g" },
  { label: "Sole Thickness", value: "6–9mm" },
  { label: "Flexibility", value: "360° Multi-Directional" },
  { label: "Toe Box", value: "Anatomical, Wide" },
  { label: "Ground Feel", value: "High" },
  { label: "Water Resistance", value: "Non-Waterproof" },
  { label: "Best Use", value: "Lifestyle, Travel, Gym, Yoga, Hiking" },
] as const;

export const nomadMeta = {
  brand: "KLΘT",
  model: "NOMAD",
  category: "Barefoot / Lifestyle / Outdoor",
  gender: "Unisex",
  sizeRange: "EU 35–45",
  sku: "KLT-NMD-BGP-001",
  release: "October 2026",
  origin: "Lagos, Nigeria",
  priceUSD: 135,
} as const;

/** KLΘT NOMAD ships on a 2-size scale — each mold covers a pair of
 * consecutive EU sizes. These labels match the printed size chart. */
export const nomadSizeScale = [
  "35/36",
  "37/38",
  "39/40",
  "41/42",
  "43/44",
  "44/45",
] as const;

/**
 * First-run scarcity messaging, sold as waves rather than a hard cap —
 * inventory itself stays unlimited (preorders never stop), this only
 * controls what the "N / cap pairs claimed" badge on the product page
 * shows. `cap` is the cumulative total pairs claimed at which that wave
 * closes. To open a new wave once the current one fills, just append
 * another entry (e.g. { label: "Wave 3", cap: 900 }) and redeploy — no
 * DB or schema changes needed. Once claimed pairs exceed every defined
 * wave's cap, the badge quietly stops rendering rather than showing a
 * stale number.
 */
export const productionWaves = [
  { label: "Wave 1", cap: 300 },
  { label: "Wave 2", cap: 600 },
] as const;

/**
 * Set this once a real delivery date is locked in — the waitlist drip's
 * "your pair ships soon" email (Email 3) only sends once today is within
 * 7 days of this date. Leave null until then; the cron job skips that
 * step entirely while it's unset, so nothing sends prematurely.
 * Format: "YYYY-MM-DD".
 */
export const releaseDate: string | null = null;
