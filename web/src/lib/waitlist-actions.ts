"use server";

import { db } from "@/lib/db";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(email: string, source: string) {
  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_RE.test(trimmed)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  try {
    await db.waitlistEntry.create({ data: { email: trimmed, source } });
  } catch (err) {
    const isDuplicate =
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "P2002";

    if (!isDuplicate) {
      return { ok: false, error: "Something went wrong. Try again." };
    }
  }

  return { ok: true };
}
