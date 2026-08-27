-- AlterTable
ALTER TABLE "account" ADD COLUMN "issuer" TEXT NOT NULL DEFAULT 'local:credential';

ALTER TABLE "account" ALTER COLUMN "issuer" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "account_issuer_accountId_key" ON "account"("issuer", "accountId");
