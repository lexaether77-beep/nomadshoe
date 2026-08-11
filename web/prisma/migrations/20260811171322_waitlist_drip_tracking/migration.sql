-- AlterTable: add drip-tracking columns
ALTER TABLE "WaitlistEntry"
  ADD COLUMN "unsubscribeToken" TEXT,
  ADD COLUMN "unsubscribedAt" TIMESTAMP(3),
  ADD COLUMN "welcomeEmailSentAt" TIMESTAMP(3),
  ADD COLUMN "progressEmailSentAt" TIMESTAMP(3),
  ADD COLUMN "launchEmailSentAt" TIMESTAMP(3);

-- Backfill: generate a unique token for any existing rows before
-- making the column required.
UPDATE "WaitlistEntry"
SET "unsubscribeToken" = md5(random()::text || clock_timestamp()::text || id)
WHERE "unsubscribeToken" IS NULL;

-- Now safe to enforce NOT NULL + uniqueness.
ALTER TABLE "WaitlistEntry" ALTER COLUMN "unsubscribeToken" SET NOT NULL;
CREATE UNIQUE INDEX "WaitlistEntry_unsubscribeToken_key" ON "WaitlistEntry"("unsubscribeToken");
