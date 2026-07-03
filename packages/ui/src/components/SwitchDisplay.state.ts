import type { SwitchDisplayProps } from "./SwitchDisplay";

import { useToggleHaptic } from "../hooks";

export const useSwitchDisplayState = ({ checked = false, disabled = false }: SwitchDisplayProps) => {
  useToggleHaptic(checked, disabled);

  return { checked, disabled };
};
