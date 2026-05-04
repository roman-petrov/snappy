import type { StaticFormAnswers } from "../../../core";
import type { useStaticVisualAgentComponentState } from "./StaticVisualAgentComponent.state";

import { AgentFeed } from "../../components/agent-feed";

type StaticVisualAgentComponentViewProps = ReturnType<typeof useStaticVisualAgentComponentState>;

export const StaticVisualAgentComponentView = ({
  entries,
  finishVisible,
  formProps,
  locale,
  onFinish,
}: StaticVisualAgentComponentViewProps) => (
  <AgentFeed
    entries={entries}
    finishVisible={finishVisible}
    locale={locale}
    onFinish={onFinish}
    onFormCancel={() => {
      formProps?.onCancel();
    }}
    onFormSubmit={value => {
      formProps?.onSubmit(value as StaticFormAnswers);
    }}
    pendingForm={formProps === undefined ? undefined : { plan: formProps.plan }}
  />
);
