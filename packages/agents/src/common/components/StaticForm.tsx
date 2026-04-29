import type { StaticFormAnswers, StaticFormPlan } from "../../core";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps = {
  disabled?: boolean;
  onCancel: () => void;
  onSubmit: (value: StaticFormAnswers) => void;
  plan: StaticFormPlan;
};

export const StaticForm = (props: StaticFormProps) => <StaticFormView {...useStaticFormState(props)} />;
