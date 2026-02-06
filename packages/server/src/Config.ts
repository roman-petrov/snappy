/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable preserve-caught-error */
import { z } from "zod";

const loadedSchema = z.object({
  botToken: z.string().min(1, `botToken is required`),
  gigaChatAuthKey: z.string().min(1, `gigaChatAuthKey is required`),
  yooKassaSecretKey: z.string().optional(),
  yooKassaShopId: z.string().optional(),
});

export type LoadedConfig = z.infer<typeof loadedSchema>;

export const Config = (raw: string, source = `config`): LoadedConfig => {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Failed to parse JSON from ${source}: ${error instanceof Error ? error.message : String(error)}`);
  }

  const result = loadedSchema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map(issue => `  - ${issue.path.join(`.`)}: ${issue.message}`).join(`\n`);
    throw new Error(`Invalid config:\n${issues}`);
  }

  return result.data;
};
