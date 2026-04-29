/* eslint-disable functional/prefer-tacit */
import { type AgentAiConfig, Agents } from "@snappy/agents";
import { useStoreValue } from "@snappy/store";
import { $locale, Locale, useAsyncEffect, useGo } from "@snappy/ui";
import { createElement, useCallback, useMemo, useState } from "react";

import { agentAiFromSettings, trpc } from "../../core";
import { Routes } from "../../Routes";
import { ChatFeed } from "../feed/ChatFeed";

export const useDashboardState = () => {
  type ChatPhase = `blocked` | `booting` | `ready`;

  const go = useGo();
  const locale = useStoreValue($locale);
  const effectiveLocale = locale === `system` ? Locale.effective() : locale;
  const chatFeed = useMemo(() => ChatFeed(), []);
  const cards = useMemo(() => Agents.cards(effectiveLocale), [effectiveLocale]);
  const [selectedAgentId, setSelectedAgentId] = useState(``);

  const selectedAgent = useMemo(
    () => (selectedAgentId.trim() === `` ? undefined : Agents.byId(selectedAgentId, effectiveLocale)),
    [effectiveLocale, selectedAgentId],
  );

  const [phase, setPhase] = useState<ChatPhase>(`booting`);
  const [aiConfig, setAiConfig] = useState<AgentAiConfig | undefined>(undefined);
  const [agentRunning, setAgentRunning] = useState(false);

  useAsyncEffect(async () => {
    setPhase(`booting`);
    const [balance, settings] = await Promise.all([trpc.user.balance.query(), trpc.user.settings.get.query()]);
    setAiConfig(agentAiFromSettings(settings));
    const billViaProxy = !(settings.aiTunnelDirect && settings.aiTunnelKey.trim() !== ``);
    if (billViaProxy && balance <= 0) {
      setPhase(`blocked`);
      void go(Routes.balance.low, { replace: true });

      return;
    }
    setPhase(`ready`);
  }, [go]);

  const onPickAgent = useCallback((id: string) => {
    setSelectedAgentId(id);
  }, []);

  const agentScreen =
    phase !== `ready` || aiConfig === undefined || selectedAgent === undefined
      ? undefined
      : createElement(selectedAgent.component, {
          aiConfig,
          locale: effectiveLocale,
          onArtifacts: async items =>
            chatFeed.appendArtifacts(items.map(item => ({ ...item, agentId: selectedAgent.id }))),
          onRequestClose: () => setSelectedAgentId(``),
          onRunningChange: setAgentRunning,
        });

  return {
    agentRunning,
    agentScreen,
    onFeed: async () => go(Routes.feed),
    onPickAgent,
    onStop: () => setSelectedAgentId(``),
    presets: { byGroup: Agents.byGroup(cards), groupOrder: Agents.groupOrder },
  };
};
