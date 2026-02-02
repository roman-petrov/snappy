/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-try-statements */
/* eslint-disable preserve-caught-error */
import { existsSync, readFileSync } from "node:fs";
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
  let raw: string;
  let configSource: string;

  // Пытаемся загрузить из файла
  if (existsSync(configPath)) {
    raw = readFileSync(configPath, `utf-8`);
    configSource = configPath;
  } else {
    // Если файл не найден, пытаемся загрузить из переменной окружения
    const envConfig = process.env[`SNAPPY_CONFIG`];
    if (envConfig === undefined) {
      throw new Error(`Config file not found at ${configPath} and SNAPPY_CONFIG environment variable is not set`);
    }

    try {
      raw = Buffer.from(envConfig, `base64`).toString(`utf-8`);
      configSource = `SNAPPY_CONFIG environment variable`;
    } catch (error) {
      throw new Error(
        `Failed to decode SNAPPY_CONFIG from base64: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON from ${configSource}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const result = configSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map(issue => `  - ${issue.path.join(`.`)}: ${issue.message}`).join(`\n`);
    throw new Error(`Invalid config in ${configSource}:\n${issues}`);
  }

  return result.data;
};

export const Config = loadConfig();

