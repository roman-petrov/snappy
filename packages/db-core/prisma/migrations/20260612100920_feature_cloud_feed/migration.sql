-- CreateTable
CREATE TABLE "feed_artifact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "generationPrompt" TEXT NOT NULL,
    "text" TEXT NOT NULL DEFAULT '',
    "src" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feed_artifact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feed_artifact_userId_createdAt_id_idx" ON "feed_artifact"("userId", "createdAt" DESC, "id" DESC);

-- AddForeignKey
ALTER TABLE "feed_artifact" ADD CONSTRAINT "feed_artifact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
