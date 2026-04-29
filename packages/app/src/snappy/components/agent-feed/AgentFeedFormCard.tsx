import type { StaticFormAnswersOf, StaticFormPlan } from "@snappy/snappy-sdk";

import { StaticForm } from "../StaticForm";
import styles from "./AgentFeedFormCard.module.scss";

export type AgentFeedFormCardProps<TPlan extends StaticFormPlan = StaticFormPlan> = {
  onSubmit: (value: StaticFormAnswersOf<TPlan>) => void;
  plan: TPlan;
};

export const AgentFeedFormCard = <TPlan extends StaticFormPlan>({ onSubmit, plan }: AgentFeedFormCardProps<TPlan>) => (
  <div className={styles.root}>
    <StaticForm active onSubmit={onSubmit} plan={plan} />
  </div>
);
