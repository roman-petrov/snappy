/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
import { Config } from "@snappy/config";

import { Database } from "./Database";

const db = Database(Config.dbUrl);

try {
  process.stdout.write(`🌱 Seeding database...\n`);

  const user = await db.user.upsert({
    create: { telegramId: 123_456_789 },
    update: {},
    where: { telegramId: 123_456_789 },
  });

  await db.snappySettings.upsert({
    create: { lastReset: new Date(), requestCount: 0, userId: user.id },
    update: {},
    where: { userId: user.id },
  });

  process.stdout.write(`✅ Created test user with id: ${user.id}\n`);
  process.stdout.write(`🌱 Seeding completed!\n`);
  await db.$disconnect();
} catch (error) {
  console.error(error);
  await db.$disconnect();
  process.exit(1);
}
