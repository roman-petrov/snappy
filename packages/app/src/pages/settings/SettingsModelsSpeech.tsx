import { useSettingsModelsSpeechState } from "./SettingsModelsSpeech.state";
import { SettingsModelsSpeechView } from "./SettingsModelsSpeech.view";

export const SettingsModelsSpeech = () => <SettingsModelsSpeechView {...useSettingsModelsSpeechState()} />;
