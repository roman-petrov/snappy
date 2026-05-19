import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { StaticForm } from "../../StaticForm";
import styles from "./AgentFeedMessageForm.module.scss";

export type AgentFeedMessageFormProps<TPlan extends StaticFormPlan = StaticFormPlan> = {
  onSubmit: (value: StaticFormAnswersOf<TPlan>) => void;
  plan: TPlan;
};

export const AgentFeedMessageForm = <TPlan extends StaticFormPlan>({
  onSubmit,
  plan,
}: AgentFeedMessageFormProps<TPlan>) => (
  <div className={styles.root}>
    <StaticForm active onSubmit={onSubmit} plan={plan} />
  </div>
);
