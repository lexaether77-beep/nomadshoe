import { headers } from "next/headers";

/**
 * Constant-time string comparison — avoids leaking secret contents via
 * response-timing side channels. Pure JS (TextEncoder is a standard Web
 * API), so this works in both the Edge runtime (middleware) and Node
 * (route handlers, server actions) without any Node-only crypto import.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  const len = Math.max(bufA.length, bufB.length, 1);
  let result = bufA.length === bufB.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    const byteA = i < bufA.length ? bufA[i] : 0;
    const byteB = i < bufB.length ? bufB[i] : 0;
    result |= byteA ^ byteB;
  }
  return result === 0;
}

/** Shared Basic Auth check for the admin area — used by both the edge
 * middleware (first line of defense) and requireAdmin() (defense in
 * depth, called again inside each admin server action/route). */
export function checkAdminBasicAuth(authHeader: string | null): boolean {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;
  if (!user || !pass || !authHeader) return false;

  const [scheme, encoded] = authHeader.split(" ");
  if (scheme !== "Basic" || !encoded) return false;

  const [providedUser, providedPass] = atob(encoded).split(":");
  return (
    timingSafeEqual(providedUser ?? "", user) &&
    timingSafeEqual(providedPass ?? "", pass)
  );
}

/** Defense-in-depth admin check — call this inside every admin server
 * action / route handler, in addition to (not instead of) the edge
 * middleware that gates /admin/:path*. Not itself a Server Action:
 * this file has no "use server" directive, so it's just a regular
 * server-only function, never directly invocable from the client. */
export async function requireAdmin() {
  const auth = (await headers()).get("authorization");
  if (!checkAdminBasicAuth(auth)) throw new Error("Unauthorized");
}
