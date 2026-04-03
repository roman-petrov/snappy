import type { TabButtonProps } from "./TabButton";

export const useTabButtonState = ({ active, onClick, text, ...rest }: TabButtonProps) => {
  const onPress = () => {
    onClick?.();

    document.activeElement?.scrollIntoView({ behavior: `smooth`, block: `nearest`, inline: `center` });
  };

  return { ...rest, active, onPress, text, vibrate: `segmentTick` as const };
};
