"use server";

import { db } from "@/lib/db";
import { sendWaitlistWelcome } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(email: string, source: string) {
  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_RE.test(trimmed)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  try {
    const entry = await db.waitlistEntry.create({
      data: { email: trimmed, source },
    });
    const sent = await sendWaitlistWelcome(entry.email, entry.unsubscribeToken);
    if (sent) {
      await db.waitlistEntry.update({
        where: { id: entry.id },
        data: { welcomeEmailSentAt: new Date() },
      });
    }
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
