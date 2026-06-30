import { Redirect } from "@snappy/app-router";
import { Page } from "@snappy/ui";

import type { useStaticChatState } from "./StaticChat.state";

import { BalanceTap } from "../../../components";
import { Routes } from "../../../Routes";
import { AgentChat } from "../ui";

export type StaticChatViewProps = ReturnType<typeof useStaticChatState>;

export const StaticChatView = ({ agent, chatProps, pageTitle }: StaticChatViewProps) =>
  agent === undefined || chatProps === undefined ? (
    <Redirect to={Routes.$.home} />
  ) : (
    <Page back title={pageTitle} trailing={<BalanceTap />}>
      <AgentChat {...chatProps} />
    </Page>
  );
