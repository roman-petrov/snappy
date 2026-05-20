import { StaticForm, type StaticFormProps } from "../../StaticForm";
import styles from "./AgentFeedMessageForm.module.scss";

export type AgentFeedMessageFormProps = StaticFormProps;

export const AgentFeedMessageForm = (props: AgentFeedMessageFormProps) => (
  <div className={styles.root}>
    <StaticForm {...props} />
  </div>
);
