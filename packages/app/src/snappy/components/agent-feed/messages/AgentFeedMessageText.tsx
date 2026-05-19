import { TextCard, type TextCardProps } from "../../TextCard";
import styles from "./AgentFeedMessageText.module.scss";

export type AgentFeedMessageTextProps = TextCardProps;

export const AgentFeedMessageText = (props: AgentFeedMessageTextProps) => (
  <div className={styles.root}>
    <TextCard {...props} />
  </div>
);
