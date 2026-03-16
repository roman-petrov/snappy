-- CreateTable
CREATE TABLE "subscriptions" (
    "userId" INTEGER NOT NULL,
    "premiumUntil" TIMESTAMP(3) NOT NULL,
    "nextBillingAt" TIMESTAMP(3) NOT NULL,
    "autoRenew" BOOLEAN NOT NULL DEFAULT true,
    "yooKassaPaymentMethodId" TEXT,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "payment_logs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "userId" INTEGER,
    "yooKassaPaymentId" TEXT,
    "amount" DECIMAL(12,2),
    "currency" TEXT,
    "status" TEXT NOT NULL,
    "idempotenceKey" TEXT,
    "errorMessage" TEXT,
    "paymentMethodId" TEXT,

    CONSTRAINT "payment_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
