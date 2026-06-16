import { _ } from "@snappy/core";
import { Logo, Page, PageChrome } from "@snappy/ui";

import type { useSnappyChatState } from "./SnappyChat.state";

import { BalanceTap } from "../../../components";
import { AgentChat, Composer } from "../../../snappy/components";
import styles from "./SnappyChat.module.scss";

export type SnappyChatViewProps = ReturnType<typeof useSnappyChatState>;

export const SnappyChatView = ({ chatProps, composer, started }: SnappyChatViewProps) => (
  <Page back title={<Logo />} trailing={<BalanceTap />}>
    <AgentChat {...chatProps} />
    <PageChrome
      active={started}
      cn={_.cn(styles.composer, started ? styles.composerStarted : styles.composerIdle)}
      fixed={started}
      role="page"
    >
      <Composer onChange={composer.setDraft} onSend={composer.onSend} value={composer.draft} />
    </PageChrome>
  </Page>
);
