import type { StaticFormAnswers, StaticFormPlan } from "../Meta";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps = {
  disabled?: boolean;
  onChange?: (answers: StaticFormAnswers) => void;
  onSubmit: (answers: StaticFormAnswers) => void;
  plan: StaticFormPlan;
};

export const StaticForm = (props: StaticFormProps) => <StaticFormView {...useStaticFormState(props)} />;
