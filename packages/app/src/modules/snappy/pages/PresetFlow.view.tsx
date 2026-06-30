import { Redirect } from "@snappy/app-router";

import type { usePresetFlowState } from "./PresetFlow.state";

import { Routes } from "../../../Routes";

export type PresetFlowViewProps = ReturnType<typeof usePresetFlowState>;

export const PresetFlowView = ({ flow, invalid, presetId }: PresetFlowViewProps) => {
  if (invalid || flow === undefined) {
    return <Redirect to={Routes.$.home} />;
  }

  const Page = flow.page;

  return <Page presetId={presetId} />;
};
