import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { z } from "zod";

const ConfigSchema = z.object({
  BOT_TOKEN: z.string().min(1, "BOT_TOKEN is required"),
  GIGACHAT_AUTH_KEY: z.string().min(1, "GIGACHAT_AUTH_KEY is required"),
  GIGACHAT_SCOPE: z.string().default("GIGACHAT_API_PERS"),
  YOOKASSA_SHOP_ID: z.string().optional(),
  YOOKASSA_SECRET_KEY: z.string().optional(),
  DEFAULT_LANGUAGE: z.enum(["ru", "en"]).default("ru"),
  FREE_REQUESTS_LIMIT: z.coerce.number().int().positive().default(10),
  PREMIUM_PRICE: z.coerce.number().int().positive().default(299),
});

export type Config = z.infer<typeof ConfigSchema>;

const configPath = join(homedir(), "snappy", "config.json");

function loadConfig(): Config {
  let raw: string;
  try {
    raw = readFileSync(configPath, "utf-8");
  } catch (err) {
    const path = configPath;
    const isNotFound = err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code === "ENOENT";
    const msg = isNotFound
      ? `Config file not found: ${path}. Create the file and add your settings. See config.json.example.`
      : `Failed to read config from ${path}: ${err instanceof Error ? err.message : String(err)}`;
    throw new Error(msg);
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON in ${configPath}: ${err instanceof Error ? err.message : String(err)}`);
  }

  const result = ConfigSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map(i => `  - ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid config in ${configPath}:\n${issues}`);
  }

  return result.data;
}

export const config = loadConfig();
