import { z } from "zod";

export const staticTabOptionSchema = z.object({
  label: z.string().min(1),
  prompt: z.string().optional(),
  value: z.string().min(1),
});

const staticFormFieldBase = { id: z.string().min(1), label: z.string().min(1) };

export const staticFormFieldSchema = z.discriminatedUnion(`kind`, [
  z.object({
    ...staticFormFieldBase,
    accept: z.string().optional(),
    hint: z.string().optional(),
    kind: z.literal(`file`),
    pickLabel: z.string().min(1),
  }),
  z.object({
    ...staticFormFieldBase,
    default: z.boolean().optional(),
    kind: z.literal(`toggle`),
    promptOff: z.string().optional(),
    promptOn: z.string().optional(),
  }),
  z.object({
    ...staticFormFieldBase,
    default: z.string().optional(),
    kind: z.literal(`tabs_single`),
    options: z.array(staticTabOptionSchema),
  }),
  z.object({
    ...staticFormFieldBase,
    default: z.array(z.string()).optional(),
    kind: z.literal(`tabs_multi`),
    options: z.array(staticTabOptionSchema),
  }),
  z.object({
    ...staticFormFieldBase,
    default: z.string().optional(),
    kind: z.literal(`text`),
    omitWhenEmpty: z.boolean().optional(),
    placeholder: z.string().optional(),
    prompt: z.string().optional(),
  }),
]);

export const staticFormPlanSchema = z.object({ fields: z.array(staticFormFieldSchema) });

export type StaticFormAnswers = Record<string, boolean | File | number | string | string[] | undefined>;

export type StaticFormField = z.infer<typeof staticFormFieldSchema>;

export type StaticFormPlan = z.infer<typeof staticFormPlanSchema>;

export type StaticTabOption = z.infer<typeof staticTabOptionSchema>;
