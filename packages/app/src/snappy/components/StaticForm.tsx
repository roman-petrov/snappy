import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps<TPlan extends StaticFormPlan = StaticFormPlan> = {
  onSubmit: (value: StaticFormAnswersOf<TPlan>) => void;
  plan: TPlan;
};

export const StaticForm = <TPlan extends StaticFormPlan>(props: StaticFormProps<TPlan>) => (
  <StaticFormView {...useStaticFormState(props)} />
);
