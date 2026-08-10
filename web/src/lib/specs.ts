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
  "45/45",
] as const;
