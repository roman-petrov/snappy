import type { TapProps } from "./Tap";

import { useTabButtonState } from "./TabButton.state";
import { TabButtonView } from "./TabButton.view";

export type TabButtonProps = Omit<TapProps, `ariaPressed` | `children` | `cn`> & {
  active?: boolean;
  text: string;
  toggle?: boolean;
};

export const TabButton = (props: TabButtonProps) => <TabButtonView {...useTabButtonState(props)} />;
