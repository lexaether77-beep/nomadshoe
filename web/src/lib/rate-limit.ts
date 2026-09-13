import { headers } from "next/headers";

/**
 * Best-effort, in-memory, per-instance rate limiting. Vercel runs
 * multiple serverless instances and this Map isn't shared between them
 * (and resets on cold start), so a determined attacker can get several
 * times the nominal limit by hitting different instances. That's an
 * accepted tradeoff for now — this stops casual/scripted abuse without
 * provisioning a shared store (Redis/KV). Revisit if real abuse shows up.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();
let callCount = 0;

export function isRateLimited(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Opportunistic cleanup so the Map doesn't grow unbounded on a
  // long-lived warm instance.
  callCount++;
  if (callCount % 100 === 0) {
    for (const [k, v] of buckets) {
      if (now > v.resetAt) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (bucket.count >= limit) return true;
  bucket.count++;
  return false;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
