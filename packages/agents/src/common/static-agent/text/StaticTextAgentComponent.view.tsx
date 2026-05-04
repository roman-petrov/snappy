import type { StaticFormAnswers } from "../../../core";
import type { useStaticTextAgentComponentState } from "./StaticTextAgentComponent.state";

import { AgentFeed } from "../../components/agent-feed";

type StaticTextAgentComponentViewProps = ReturnType<typeof useStaticTextAgentComponentState>;

export const StaticTextAgentComponentView = ({
  entries,
  finishVisible,
  formProps,
  locale,
  onFinish,
}: StaticTextAgentComponentViewProps) => (
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
