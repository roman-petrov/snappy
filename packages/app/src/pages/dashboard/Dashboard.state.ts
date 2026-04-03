import { type AgentCard, type AgentGroupId, Agents } from "@snappy/agents";
import { useStoreValue } from "@snappy/store";
import { $locale, Locale, useAsyncEffect, useGo } from "@snappy/ui";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../../core";
import { Routes } from "../../Routes";

export const useDashboardState = () => {
  const go = useGo();
  const [blockShell, setBlockShell] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [groupOrder, setGroupOrder] = useState<readonly AgentGroupId[]>([]);
  const locale = useStoreValue($locale);

  useAsyncEffect(async () => {
    setInitLoading(true);
    setBlockShell(false);
    const loc = Locale.effective();
    const balanceResponse = await api.balanceGet();
    if (balanceResponse.balance <= 0) {
      setBlockShell(true);
      void go(Routes.balance.low, { replace: true });
      setInitLoading(false);

      return;
    }
    setAgents([...Agents.localized(loc)]);
    setGroupOrder(Agents.groupOrder);
    setInitLoading(false);
  }, [go, locale]);

  const byGroup = Agents.byGroup(agents);
  const navigate = useNavigate();

  const onPick = (id: string) => {
    void navigate(Routes.agent(id));
  };

  return { blockShell, byGroup, groupOrder, initLoading, onPick };
};
