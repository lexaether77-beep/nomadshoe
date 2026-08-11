import { productionWaves } from "@/lib/specs";

export type CurrentWave = { label: string; claimed: number; cap: number };

/** Pure — safe to import from client components. No DB access here. */
export function getCurrentWave(claimedPairs: number): CurrentWave | null {
  const wave = productionWaves.find((w) => claimedPairs < w.cap);
  if (!wave) return null;
  return { label: wave.label, claimed: claimedPairs, cap: wave.cap };
}
