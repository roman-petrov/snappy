import type { useFreeOrchestratorComponentState } from "./FreeOrchestratorComponent.state";

import { AgentFeed } from "../../common/components/agent-feed";
import { Start } from "./Start";

type FreeOrchestratorComponentViewProps = ReturnType<typeof useFreeOrchestratorComponentState>;

export const FreeOrchestratorComponentView = ({
  entries,
  finishVisible,
  locale,
  onFinish,
  onFormCancel,
  onFormSubmit,
  pendingForm,
  starterProps,
}: FreeOrchestratorComponentViewProps) => (
  <>
    {starterProps === undefined ? undefined : <Start {...starterProps} />}
    <AgentFeed
      entries={entries}
      finishVisible={finishVisible}
      locale={locale}
      onFinish={onFinish}
      onFormCancel={onFormCancel}
      onFormSubmit={onFormSubmit}
      pendingForm={pendingForm === undefined ? undefined : { plan: pendingForm.plan }}
    />
  </>
);
