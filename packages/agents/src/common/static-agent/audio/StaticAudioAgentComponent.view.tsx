import type { StaticFormAnswers } from "../../../core";
import type { useStaticAudioAgentComponentState } from "./StaticAudioAgentComponent.state";

import { AgentFeed } from "../../components/agent-feed";

type StaticAudioAgentComponentViewProps = ReturnType<typeof useStaticAudioAgentComponentState>;

export const StaticAudioAgentComponentView = ({
  entries,
  finishVisible,
  formProps,
  locale,
  onFinish,
}: StaticAudioAgentComponentViewProps) => (
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
