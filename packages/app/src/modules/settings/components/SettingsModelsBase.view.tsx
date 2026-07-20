import { Page } from "@snappy/ui";

import type { useSettingsModelsBaseState } from "./SettingsModelsBase.state";

import { SettingsModelsList } from "./SettingsModelsList";
import { SettingsOptionList } from "./SettingsOptionList";

export type SettingsModelsBaseViewProps = ReturnType<typeof useSettingsModelsBaseState>;

export const SettingsModelsBaseView = ({ title, ...props }: SettingsModelsBaseViewProps) => (
  <Page back title={title}>
    {props.grouped ? (
      <SettingsModelsList
        modelFilter={props.modelFilter}
        modelType={props.modelType}
        select={props.select}
        value={props.value}
      />
    ) : (
      <SettingsOptionList options={props.options} select={props.select} value={props.value} />
    )}
  </Page>
);
