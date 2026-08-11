import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendWaitlistProgress, sendWaitlistLaunch } from "@/lib/email";
import { releaseDate } from "@/lib/specs";

const PROGRESS_EMAIL_DELAY_DAYS = 28;
const LAUNCH_EMAIL_WINDOW_DAYS = 7;

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let progressSent = 0;
  let launchSent = 0;

  // Email 2 — production progress, 28 days after signup.
  const progressCutoff = new Date(
    Date.now() - PROGRESS_EMAIL_DELAY_DAYS * 24 * 60 * 60 * 1000
  );
  const progressCandidates = await db.waitlistEntry.findMany({
    where: {
      unsubscribedAt: null,
      progressEmailSentAt: null,
      createdAt: { lte: progressCutoff },
    },
  });
  for (const entry of progressCandidates) {
    const sent = await sendWaitlistProgress(entry.email, entry.unsubscribeToken);
    if (sent) {
      await db.waitlistEntry.update({
        where: { id: entry.id },
        data: { progressEmailSentAt: new Date() },
      });
      progressSent++;
    }
  }

  // Email 3 — "ships soon", only once a real release date is configured
  // and we're within LAUNCH_EMAIL_WINDOW_DAYS of it.
  if (releaseDate) {
    const target = new Date(releaseDate);
    const daysUntil = (target.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
    if (daysUntil <= LAUNCH_EMAIL_WINDOW_DAYS) {
      const launchCandidates = await db.waitlistEntry.findMany({
        where: { unsubscribedAt: null, launchEmailSentAt: null },
      });
      for (const entry of launchCandidates) {
        const sent = await sendWaitlistLaunch(entry.email, entry.unsubscribeToken);
        if (sent) {
          await db.waitlistEntry.update({
            where: { id: entry.id },
            data: { launchEmailSentAt: new Date() },
          });
          launchSent++;
        }
      }
    }
  }

  return NextResponse.json({ progressSent, launchSent });
}
