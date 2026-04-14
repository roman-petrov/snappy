import type { StaticFormAnswers, StaticFormPlan } from "../../core";
import type { AgentUiProps } from "../../Types";

import { useStaticFormState } from "./StaticForm.state";
import { StaticFormView } from "./StaticForm.view";

export type StaticFormProps = AgentUiProps<StaticFormAnswers> & { disabled?: boolean; plan: StaticFormPlan };

export const StaticForm = (props: StaticFormProps) => <StaticFormView {...useStaticFormState(props)} />;
