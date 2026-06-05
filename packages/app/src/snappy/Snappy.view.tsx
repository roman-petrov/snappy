import { _ } from "@snappy/core";
import { Page } from "@snappy/ui";

import type { useSnappyState } from "./Snappy.state";

import { AgentChat, Composer } from "./components";
import styles from "./Snappy.module.scss";

export type SnappyViewProps = ReturnType<typeof useSnappyState>;

export const SnappyView = ({ chatProps, composer, started }: SnappyViewProps) => (
  <Page>
    <div className={_.cn(styles.shell, started && styles.shellStarted)}>
      <AgentChat {...chatProps} />
      <div className={_.cn(styles.composer, started && styles.composerStarted)}>
        <Composer onChange={composer.setDraft} onSend={composer.onSend} value={composer.draft} />
      </div>
    </div>
  </Page>
);
