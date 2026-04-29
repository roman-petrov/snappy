import { TextCard, type TextCardProps } from "../TextCard";
import styles from "./AgentFeedTextCard.module.scss";

export const AgentFeedTextCard = (props: TextCardProps) => (
  <div className={styles.root}>
    <TextCard {...props} />
  </div>
);
