import { Redirect } from "@snappy/app-router";
import { _ } from "@snappy/core";
import { Logo, Page, PageChrome, Text } from "@snappy/ui";

import type { useSnappyChatState } from "./SnappyChat.state";

import { BalanceTap } from "../../../components";
import { Routes } from "../../../Routes";
import { AgentChat, Composer } from "../../../snappy/components";
import styles from "./SnappyChat.module.scss";

export type SnappyChatViewProps = ReturnType<typeof useSnappyChatState>;

export const SnappyChatView = ({ chatProps, composer, invalidPreset, pageTitle, started }: SnappyChatViewProps) =>
  invalidPreset ? (
    <Redirect to={Routes.$.home} />
  ) : (
    <>
      <Page
        back
        fill
        title={pageTitle === undefined ? <Logo /> : <Text text={pageTitle} typography="h3" />}
        trailing={<BalanceTap />}
      >
        <AgentChat {...chatProps} />
      </Page>
      <PageChrome active={started} cn={_.cn(styles.composer, !started && styles.composerIdle)}>
        <Composer onChange={composer.setDraft} onSend={composer.onSend} value={composer.draft} />
      </PageChrome>
    </>
  );
