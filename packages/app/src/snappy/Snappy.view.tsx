import { SafeArea } from "@snappy/ui";

import type { useSnappyState } from "./Snappy.state";

import { Page } from "../components";
import { AgentChat, Composer } from "./components";
import styles from "./Snappy.module.scss";

export type SnappyViewProps = ReturnType<typeof useSnappyState>;

export const SnappyView = ({ chatProps, composer, started }: SnappyViewProps) => (
  <Page title="Snappy">
    <div className={started ? `${styles.shell} ${styles.shellDocked}` : styles.shell}>
      <AgentChat {...chatProps} />
      <div className={started ? `${styles.composer} ${styles.composerDocked}` : styles.composer}>
        <SafeArea bottom={started}>
          <div className={styles.composerInner}>
            <Composer onChange={composer.setDraft} onSend={composer.onSend} value={composer.draft} />
          </div>
        </SafeArea>
      </div>
    </div>
  </Page>
);
