import { z } from "zod";

const labelSchema = z.object({ emoji: z.string().min(1), text: z.string().min(1) });
const tabOptionSchema = z.object({ label: labelSchema, prompt: z.string().optional(), value: z.string().min(1) });
const base = { id: z.string().min(1), label: labelSchema };

const fieldSchema = z.discriminatedUnion(`kind`, [
  z.object({
    ...base,
    accept: z.string().optional(),
    hint: z.string().optional(),
    kind: z.literal(`file_input`),
    pickLabel: z.string().min(1),
  }),
  z.object({
    ...base,
    default: z.boolean().optional(),
    kind: z.literal(`binary_choice`),
    promptOff: z.string().optional(),
    promptOn: z.string().optional(),
  }),
  z.object({
    ...base,
    default: z.string().optional(),
    kind: z.literal(`single_choice`),
    options: z.array(tabOptionSchema),
  }),
  z.object({
    ...base,
    default: z.array(z.string()).optional(),
    kind: z.literal(`multiple_choice`),
    options: z.array(tabOptionSchema),
  }),
  z.object({
    ...base,
    default: z.string().optional(),
    kind: z.literal(`text_input`),
    omitWhenEmpty: z.boolean().optional(),
    placeholder: z.string().optional(),
    prompt: z.string().optional(),
  }),
]);

export const StaticFormPlanSchema = z.object({ fields: z.array(fieldSchema) });

export type StaticFormAnswers = Record<string, boolean | File | number | string | string[] | undefined>;

export type StaticFormAnswersOf<TPlan extends StaticFormPlan> = {
  [TField in TPlan[`fields`][number] as TField[`id`]]: StaticFormAnswerValue<TField>;
};

export type StaticFormAnswerValue<TField extends StaticFormField> = TField[`kind`] extends `file_input`
  ? File | undefined
  : TField[`kind`] extends `multiple_choice`
    ? string[]
    : TField[`kind`] extends `single_choice`
      ? string
      : TField[`kind`] extends `text_input`
        ? string
        : TField[`kind`] extends `binary_choice`
          ? boolean
          : never;

export type StaticFormField = z.infer<typeof fieldSchema>;

export type StaticFormLabel = z.infer<typeof labelSchema>;

export type StaticFormPlan = z.infer<typeof StaticFormPlanSchema>;
