import type { useSettingsModelsBaseState } from "./SettingsModelsBase.state";

import { Page } from "../../components";
import { SettingsOptionList } from "./components";

export type SettingsModelsBaseViewProps = ReturnType<typeof useSettingsModelsBaseState>;

export const SettingsModelsBaseView = ({ title, ...props }: SettingsModelsBaseViewProps) => (
  <Page back title={title}>
    <SettingsOptionList {...props} />
  </Page>
);
