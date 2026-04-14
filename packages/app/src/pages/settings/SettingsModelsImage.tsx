import { useSettingsModelsImageState } from "./SettingsModelsImage.state";
import { SettingsModelsImageView } from "./SettingsModelsImage.view";

export const SettingsModelsImage = () => <SettingsModelsImageView {...useSettingsModelsImageState()} />;
