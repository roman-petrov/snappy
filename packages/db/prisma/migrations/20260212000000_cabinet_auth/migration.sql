-- AlterTable
ALTER TABLE "users" ALTER COLUMN "telegramId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "email" TEXT,
ADD COLUMN "passwordHash" TEXT,
ADD COLUMN "resetToken" TEXT,
ADD COLUMN "resetTokenExpires" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
