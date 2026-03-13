-- AlterTable
ALTER TABLE "snappy_settings" ADD COLUMN     "addEmoji" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "addFormatting" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "length" TEXT NOT NULL DEFAULT 'keep',
ADD COLUMN     "style" TEXT NOT NULL DEFAULT 'neutral';
