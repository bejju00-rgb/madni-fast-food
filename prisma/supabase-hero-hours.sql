-- Hero hours on homepage (run in Supabase SQL editor if needed)
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "heroOpenTime" TEXT NOT NULL DEFAULT '6 PM';
ALTER TABLE "Settings" ADD COLUMN IF NOT EXISTS "heroCloseTime" TEXT NOT NULL DEFAULT '2 AM';

UPDATE "Settings"
SET
  "heroOpenTime" = COALESCE(NULLIF(TRIM("heroOpenTime"), ''), '6 PM'),
  "heroCloseTime" = COALESCE(NULLIF(TRIM("heroCloseTime"), ''), '2 AM')
WHERE "heroOpenTime" IS NULL OR "heroCloseTime" IS NULL;
