import { FeedStreamCard, type FeedStreamCardContentProps } from "../../FeedStreamCard";
import styles from "./AgentFeedMessageUser.module.scss";

export type AgentFeedMessageUserProps = Pick<Extract<FeedStreamCardContentProps, { text: string }>, `text`>;

export const AgentFeedMessageUser = ({ text }: AgentFeedMessageUserProps) => (
  <div className={styles.root}>
    <FeedStreamCard text={text} theme="chat" />
  </div>
);
