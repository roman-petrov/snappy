import { _ } from "@snappy/core";
import { Logo, Page, PageChrome } from "@snappy/ui";

import type { useSnappyFlowPageState } from "./SnappyFlowPage.state";

import { BalanceTap } from "../../../components";
import { AgentChat } from "./agent-feed/AgentChat";
import { Composer } from "./Composer";
import { PresetMetaPageTitle } from "./PresetMetaPageTitle";
import styles from "./SnappyFlowPage.module.scss";

export type SnappyFlowPageViewProps = ReturnType<typeof useSnappyFlowPageState>;

export const SnappyFlowPageView = ({ chatProps, composer, started, title }: SnappyFlowPageViewProps) => (
  <>
    <Page
      back
      fill
      title={title === undefined ? <Logo /> : <PresetMetaPageTitle {...title} />}
      trailing={<BalanceTap />}
    >
      <AgentChat {...chatProps} />
    </Page>
    <PageChrome active={started} cn={_.cn(styles.composer, !started && styles.composerIdle)}>
      <Composer onChange={composer.setDraft} onSend={composer.onSend} value={composer.draft} />
    </PageChrome>
  </>
);
