import { z } from "zod";

const labelSchema = z.object({ emoji: z.string().min(1), text: z.string().min(1) });
const tabOptionSchema = z.object({ label: labelSchema, prompt: z.string().optional(), value: z.string().min(1) });
const fieldKinds = [`file_input`, `binary_choice`, `single_choice`, `multiple_choice`, `text_input`] as const;

const fieldObject = z.object({
  accept: z.string().optional(),
  default: z.union([z.boolean(), z.string(), z.array(z.string())]).optional(),
  hint: z.string().optional(),
  id: z.string().min(1),
  kind: z.enum(fieldKinds),
  label: labelSchema,
  omitWhenEmpty: z.boolean().optional(),
  options: z.array(tabOptionSchema).optional(),
  pickLabel: z.string().optional(),
  placeholder: z.string().optional(),
  prompt: z.string().optional(),
  promptOff: z.string().optional(),
  promptOn: z.string().optional(),
});

const fieldSchema = fieldObject
  .refine(field => field.kind !== `file_input` || field.pickLabel !== undefined, {
    message: `pickLabel is required for file_input`,
    path: [`pickLabel`],
  })
  .refine(
    field =>
      (field.kind !== `single_choice` && field.kind !== `multiple_choice`) ||
      (field.options !== undefined && field.options.length > 0),
    { message: `options are required for single_choice and multiple_choice`, path: [`options`] },
  );

export const StaticFormPlanSchema = z.object({ fields: z.array(fieldSchema).min(1) });

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

export type StaticFormFieldByKind<TKind extends StaticFormFieldKind> = StaticFormField & { kind: TKind };

export type StaticFormFieldKind = (typeof fieldKinds)[number];

export type StaticFormLabel = z.infer<typeof labelSchema>;

export type StaticFormPlan = z.infer<typeof StaticFormPlanSchema>;
