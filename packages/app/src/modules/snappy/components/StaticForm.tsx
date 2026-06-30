import type { StaticFormAnswers, StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps<TPlan extends StaticFormPlan = StaticFormPlan> =
  | { answers: StaticFormAnswers; plan: TPlan }
  | { answers?: never; onSubmit: (value: StaticFormAnswersOf<TPlan>) => void; plan: TPlan };

export const StaticForm = <TPlan extends StaticFormPlan>(props: StaticFormProps<TPlan>) => (
  <StaticFormView {...useStaticFormState(props)} />
);
