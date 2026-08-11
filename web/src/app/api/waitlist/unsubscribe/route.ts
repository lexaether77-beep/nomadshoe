import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (token) {
    await db.waitlistEntry
      .updateMany({
        where: { unsubscribeToken: token, unsubscribedAt: null },
        data: { unsubscribedAt: new Date() },
      })
      .catch(() => {});
  }

  return NextResponse.redirect(new URL("/waitlist-unsubscribed", origin));
}
