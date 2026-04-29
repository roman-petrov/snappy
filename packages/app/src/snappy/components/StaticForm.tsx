import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps<TPlan extends StaticFormPlan = StaticFormPlan> = {
  active?: boolean;
  onSubmit: (value: StaticFormAnswersOf<TPlan>) => void;
  plan: TPlan;
};

export const StaticForm = <TPlan extends StaticFormPlan>(props: StaticFormProps<TPlan>) => {
  const { active = false, ...rest } = props;

  return <StaticFormView {...useStaticFormState(rest)} active={active} />;
};
