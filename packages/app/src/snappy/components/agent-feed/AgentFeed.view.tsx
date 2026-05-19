import type { useAgentFeedState } from "./AgentFeed.state";

import styles from "./AgentFeed.module.scss";

export type AgentFeedViewProps = ReturnType<typeof useAgentFeedState>;

export const AgentFeedView = ({ rows }: AgentFeedViewProps) => <article className={styles.root}>{rows}</article>;
