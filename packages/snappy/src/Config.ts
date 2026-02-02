// cspell:words pers
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";

const configSchema = z.object({
  BOT_TOKEN: z.string().min(1, `BOT_TOKEN is required`),
  GIGACHAT_AUTH_KEY: z.string().min(1, `GIGACHAT_AUTH_KEY is required`),
  YOOKASSA_SECRET_KEY: z.string().optional(),
  YOOKASSA_SHOP_ID: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

const configPath = join(homedir(), `snappy`, `config.json`);

const loadConfig = (): Config => {
  const raw = readFileSync(configPath, `utf-8`);
  const data: unknown = JSON.parse(raw);
  const result = configSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map(issue => `  - ${issue.path.join(`.`)}: ${issue.message}`).join(`\n`);
    throw new Error(`Invalid config in ${configPath}:\n${issues}`);
  }

  return result.data;
};

export const Config = loadConfig();
