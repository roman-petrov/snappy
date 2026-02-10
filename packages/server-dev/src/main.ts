import { Config } from "@snappy/config";
import { Database } from "@snappy/db";
import { SnappyBot } from "@snappy/snappy-bot";

const db = Database(Config.dbUrl);
const bot = SnappyBot({ ...Config, db });

process.stdout.write(`🚀 Starting bot…\n`);
void bot.start();
