/** Foot-length (cm) ranges per size-scale bucket, taken directly from
 * the printed KLΘT NOMAD size chart's Asia/cm column. */
export const sizeChartCm = [
  { size: "35/36", minCm: 22.5, maxCm: 23.0 },
  { size: "37/38", minCm: 23.5, maxCm: 24.5 },
  { size: "39/40", minCm: 25.0, maxCm: 25.5 },
  { size: "41/42", minCm: 26.0, maxCm: 26.5 },
  { size: "43/44", minCm: 27.0, maxCm: 27.5 },
  { size: "44/45", minCm: 28.0, maxCm: 28.5 },
] as const;

export type SizeRecommendation =
  | { status: "ok"; size: string; betweenSizes: boolean }
  | { status: "too-small" | "too-large" };

/** Pure — safe to import from client components. Chart has small gaps
 * between bucket ranges; a foot length landing in a gap gets rounded
 * down to the smaller bucket, matching the chart's own "if between
 * sizes, size down" guidance. */
export function recommendSize(cm: number): SizeRecommendation {
  const first = sizeChartCm[0];
  const last = sizeChartCm[sizeChartCm.length - 1];

  if (cm < first.minCm) return { status: "too-small" };
  if (cm > last.maxCm) return { status: "too-large" };

  for (let i = 0; i < sizeChartCm.length; i++) {
    const bucket = sizeChartCm[i];
    if (cm >= bucket.minCm && cm <= bucket.maxCm) {
      return { status: "ok", size: bucket.size, betweenSizes: false };
    }
    const next = sizeChartCm[i + 1];
    if (next && cm > bucket.maxCm && cm < next.minCm) {
      return { status: "ok", size: bucket.size, betweenSizes: true };
    }
  }

  return { status: "too-large" };
}
