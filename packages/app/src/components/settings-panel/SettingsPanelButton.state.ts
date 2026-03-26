import type { SettingsPanelButtonProps } from "./SettingsPanelButton";

export const useSettingsPanelButtonState = ({ active, onClick, text, ...rest }: SettingsPanelButtonProps) => {
  const onPress = () => {
    onClick?.();

    document.activeElement?.scrollIntoView({ behavior: `smooth`, block: `nearest`, inline: `center` });
  };

  return { ...rest, active, onPress, text, vibrate: `segmentTick` as const };
};
