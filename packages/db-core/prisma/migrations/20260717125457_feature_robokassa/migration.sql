-- AlterTable
ALTER TABLE "payment_logs" DROP COLUMN "paymentMethodId",
DROP COLUMN "yooKassaPaymentId",
ADD COLUMN     "paymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_logs_paymentId_status_key" ON "payment_logs"("paymentId", "status");
