/*
  Warnings:

  - You are about to drop the `snappy_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "snappy_settings" DROP CONSTRAINT "snappy_settings_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_userId_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "balance" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "snappy_settings";

-- DropTable
DROP TABLE "subscriptions";

-- CreateTable
CREATE TABLE "balance_history" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "amountRub" DECIMAL(12,2) NOT NULL,
    "balanceAfter" DECIMAL(12,2) NOT NULL,
    "meta" JSONB,

    CONSTRAINT "balance_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "userId" INTEGER NOT NULL,
    "llmChatModel" TEXT,
    "llmImageModel" TEXT,
    "llmSpeechRecognitionModel" TEXT,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "balance_history" ADD CONSTRAINT "balance_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
