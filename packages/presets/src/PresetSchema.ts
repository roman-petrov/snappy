import { UiPlanSchema } from "@snappy/domain";
import { z } from "zod";

const groupId = z.enum([`business`, `data`, `greetings`, `plans`, `text`, `visual`]);
const locale = z.enum([`en`, `ru`]);
const labels = z.object({ description: z.string(), title: z.string() });
const localeBlock = z.object({ emoji: z.string(), labels, prompt: z.string(), uiPlan: UiPlanSchema.plan });
const sourceInput = z.object({ en: localeBlock, group: groupId, ru: localeBlock });

export const PresetSchema = { groupId, labels, locale, sourceInput };

export type PresetGroupId = z.infer<typeof PresetSchema.groupId>;

export type PresetLabels = z.infer<typeof PresetSchema.labels>;

export type PresetLocale = z.infer<typeof PresetSchema.locale>;

export type PresetSourceInput = z.infer<typeof PresetSchema.sourceInput>;
