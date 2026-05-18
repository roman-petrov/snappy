import type { useSwitchState } from "./Switch.state";

import { SwitchDisplay } from "./SwitchDisplay";
import { Tap } from "./Tap";

export type SwitchViewProps = ReturnType<typeof useSwitchState>;

export const SwitchView = ({ checked, onActivate, tapProps }: SwitchViewProps) => (
  <Tap {...tapProps} onClick={onActivate}>
    <SwitchDisplay checked={checked} disabled={tapProps.disabled} />
  </Tap>
);
