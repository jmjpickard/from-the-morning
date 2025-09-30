-- Update Post table to match current Prisma schema
-- 1) Rename column "name" -> "trackId" (only if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Post'
      AND column_name = 'name'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'Post'
      AND column_name = 'trackId'
  ) THEN
    ALTER TABLE "Post" RENAME COLUMN "name" TO "trackId";
  END IF;
END $$;

-- 2) Add optional content column (idempotent)
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "content" TEXT;

-- 3) Ensure index on trackId; drop old index if it exists
DROP INDEX IF EXISTS "Post_name_idx";
CREATE INDEX IF NOT EXISTS "Post_trackId_idx" ON "Post"("trackId");

