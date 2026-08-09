// Fallback used only if the live rate lookup fails. Updated periodically;
// not load-bearing for correctness since the live rate is preferred.
const FALLBACK_USD_TO_NGN = 1600;

export async function getUsdToNgnRate(): Promise<number> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK_USD_TO_NGN;
    const body = (await res.json()) as { rates?: Record<string, number> };
    const rate = body.rates?.NGN;
    return typeof rate === "number" && rate > 0 ? rate : FALLBACK_USD_TO_NGN;
  } catch {
    return FALLBACK_USD_TO_NGN;
  }
}
