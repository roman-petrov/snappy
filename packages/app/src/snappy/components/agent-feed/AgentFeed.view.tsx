import type { useAgentFeedState } from "./AgentFeed.state";

import styles from "./AgentFeed.module.scss";
import { AgentFeedBadge } from "./AgentFeedBadge";
import { AgentFeedFormCard } from "./AgentFeedFormCard";
import { AgentFeedImageCard } from "./AgentFeedImageCard";
import { AgentFeedStreamCard } from "./AgentFeedStreamCard";
import { AgentFeedTextCard } from "./AgentFeedTextCard";
import { AgentFeedUserMessage } from "./AgentFeedUserMessage";

export type AgentFeedViewProps = ReturnType<typeof useAgentFeedState>;

export const AgentFeedView = ({ onFormSubmit, rows }: AgentFeedViewProps) => (
  <article className={styles.root}>
    {rows.map(row => {
      switch (row.variant) {
        case `badge`: {
          return <AgentFeedBadge key={row.key} {...row.props} />;
        }
        case `form`: {
          return <AgentFeedFormCard key={row.key} onSubmit={onFormSubmit} plan={row.props.plan} />;
        }
        case `image`: {
          return <AgentFeedImageCard key={row.key} {...row.props} />;
        }
        case `stream`: {
          return <AgentFeedStreamCard key={row.key} {...row.props} />;
        }
        case `text`: {
          return <AgentFeedTextCard key={row.key} {...row.props} />;
        }
        case `user`: {
          return <AgentFeedUserMessage key={row.key} text={row.props.text} />;
        }
        // No default
      }
    })}
  </article>
);
