import type { TapProps } from "./Tap";

import { useSwitchState } from "./Switch.state";
import { SwitchView } from "./Switch.view";

export type SwitchProps = Omit<TapProps, `children`> & { checked?: boolean; onChange?: (checked: boolean) => void };

export const Switch = (props: SwitchProps) => <SwitchView {...useSwitchState(props)} />;
