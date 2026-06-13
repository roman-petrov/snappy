/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { z } from "zod";

const labelSchema = z.object({
  emoji: z.string().min(1).describe(`Emoji shown with the field label.`),
  text: z.string().min(1).describe(`Short field title shown to the user.`),
});

const tabOptionSchema = z.object({
  label: labelSchema,
  prompt: z.string().optional().describe(`Optional hint appended when this option is selected.`),
  value: z.string().min(1).describe(`Stable value stored in answers and echoed back to the model.`),
});

const fileFieldKinds = [`audio_input`, `image_input`] as const;
const fieldKinds = [...fileFieldKinds, `binary_choice`, `single_choice`, `multiple_choice`, `text_input`] as const;

const fieldObject = z.object({
  default: z
    .union([z.boolean(), z.string(), z.array(z.string())])
    .optional()
    .describe(
      `Initial value: boolean for binary_choice, string for single_choice or text_input, string[] for multiple_choice.`,
    ),
  hint: z.string().optional().describe(`File picker fields only. Helper text under the picker.`),
  id: z.string().min(1).describe(`Stable field key; used as the key in returned answers JSON.`),
  kind: z
    .enum(fieldKinds)
    .describe(`Widget type: text_input, single_choice, multiple_choice, binary_choice, image_input, or audio_input.`),
  label: labelSchema,
  omitWhenEmpty: z
    .boolean()
    .optional()
    .describe(`text_input only. Skip the field in the prompt when the answer is empty.`),
  options: z
    .array(tabOptionSchema)
    .optional()
    .describe(`Required for single_choice and multiple_choice. Tabs shown to the user.`),
  pickLabel: z.string().optional().describe(`Required for file picker fields. Label on the file pick button.`),
  placeholder: z.string().optional().describe(`text_input only. Placeholder in the text box.`),
  prompt: z.string().optional().describe(`text_input only. Extra instruction appended when the field is answered.`),
  promptOff: z.string().optional().describe(`binary_choice only. Hint when the switch is off.`),
  promptOn: z.string().optional().describe(`binary_choice only. Hint when the switch is on.`),
});

const fieldSchema = fieldObject
  .refine(
    field => !fileFieldKinds.includes(field.kind as (typeof fileFieldKinds)[number]) || field.pickLabel !== undefined,
    { message: `pickLabel is required for file picker fields`, path: [`pickLabel`] },
  )
  .refine(
    field =>
      (field.kind !== `single_choice` && field.kind !== `multiple_choice`) ||
      (field.options !== undefined && field.options.length > 0),
    { message: `options are required for single_choice and multiple_choice`, path: [`options`] },
  );

export const StaticFormPlanSchema = z.object({
  fields: z
    .array(fieldSchema)
    .min(1)
    .describe(
      `Clarification form fields. Each entry is one object with id, kind, and label — not a plain question string.`,
    ),
  title: z.string().optional().describe(`Optional heading shown above the form.`),
});

export type StaticFormAnswers = Record<string, boolean | File | number | string | string[] | undefined>;

export type StaticFormAnswersOf<TPlan extends StaticFormPlan> = TPlan extends {
  fields: infer TFields extends readonly StaticFormField[];
}
  ? StaticFormFieldAnswers<TFields>
  : never;

export type StaticFormAnswersOfFields<TFields extends readonly StaticFormField[]> = StaticFormFieldAnswers<TFields>;

export type StaticFormAnswerValue<TField extends StaticFormField> = StaticFormAnswerValueByKind<TField[`kind`]>;

export type StaticFormAnswerValueByKind<TKind extends StaticFormFieldKind> = TKind extends FileFieldKind
  ? File | undefined
  : TKind extends `multiple_choice`
    ? string[]
    : TKind extends `single_choice`
      ? string
      : TKind extends `text_input`
        ? string | undefined
        : TKind extends `binary_choice`
          ? boolean
          : never;

export type StaticFormField = z.infer<typeof fieldSchema>;

export type StaticFormFieldAnswers<TFields extends readonly StaticFormField[]> = {
  [TField in TFields[number] as TField[`id`]]: StaticFormAnswerValue<TField>;
};

export type StaticFormFieldByKind<TKind extends StaticFormFieldKind> = StaticFormField & { kind: TKind };

export type StaticFormFieldKind = (typeof fieldKinds)[number];

export type StaticFormLabel = z.infer<typeof labelSchema>;

export type StaticFormPlan = { fields: readonly StaticFormField[]; title?: string };

export type StaticFormPlanOf<TFields extends readonly StaticFormField[]> = { fields: TFields; title?: string };

type FileFieldKind = (typeof fileFieldKinds)[number];

export const StaticFields = <const T extends readonly StaticFormField[]>(fields: T): T => fields;

export const StaticFormAnswersOf = <TPlan extends StaticFormPlan>(
  answers: StaticFormAnswers,
): StaticFormAnswersOf<TPlan> => answers as StaticFormAnswersOf<TPlan>;
