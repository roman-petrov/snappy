import type { StaticFormPlan } from "@snappy/snappy";

import { StaticForm as Form, type StaticFormProps } from "@snappy/ui";

import { AppTags } from "../../../AppTags";

export type { StaticFormProps } from "@snappy/ui";

export const StaticForm = <TPlan extends StaticFormPlan>({ submitTag, ...props }: StaticFormProps<TPlan>) => (
  <Form {...props} submitTag={submitTag ?? AppTags.snappy.form.continue} />
);
