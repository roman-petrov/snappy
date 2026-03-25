import type { SettingsPanelButtonProps } from "./SettingsPanelButton";

export const useSettingsPanelButtonState = ({ active, cn, onClick, text, ...rest }: SettingsPanelButtonProps) => {
  const onPress = () => {
    onClick?.();

    document.activeElement?.scrollIntoView({ behavior: `smooth`, block: `nearest`, inline: `center` });
  };

  return { ...rest, active, cn, onPress, text, vibrate: `segmentTick` as const };
};
