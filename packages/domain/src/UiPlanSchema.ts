import { z } from "zod";

const tabOption = z.object({ label: z.string(), prompt: z.string().optional(), value: z.string() });

const fieldText = z.object({
  default: z.string().optional(),
  id: z.string(),
  kind: z.literal(`text`),
  label: z.string(),
  placeholder: z.string().optional(),
  prompt: z.string().optional(),
});

const fieldToggle = z.object({
  default: z.boolean().optional(),
  id: z.string(),
  kind: z.literal(`toggle`),
  label: z.string(),
  promptOff: z.string().optional(),
  promptOn: z.string().optional(),
});

const fieldTabsSingle = z.object({
  default: z.string().optional(),
  id: z.string(),
  kind: z.literal(`tabs_single`),
  label: z.string(),
  options: z.array(tabOption).min(1),
});

const fieldTabsMulti = z.object({
  default: z.array(z.string()).optional(),
  id: z.string(),
  kind: z.literal(`tabs_multi`),
  label: z.string(),
  options: z.array(tabOption).min(1),
});

const field = z.discriminatedUnion(`kind`, [fieldText, fieldToggle, fieldTabsSingle, fieldTabsMulti]);
const plan = z.object({ fields: z.array(field).min(1), title: z.string() });
const byLocale = z.object({ en: plan, ru: plan });

export const UiPlanSchema = { byLocale, field, plan };

export type UiPlanZod = z.infer<typeof UiPlanSchema.plan>;
