-- Supabase: Dashboard → SQL Editor → New query → paste → Run
-- Adds logo URL for admin-uploaded site / PWA icon

ALTER TABLE "Settings"
ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
