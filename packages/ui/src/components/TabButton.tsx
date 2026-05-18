import type { TapProps } from "./Tap";

import { useTabButtonState } from "./TabButton.state";
import { TabButtonView } from "./TabButton.view";

export type TabButtonProps = Omit<TapProps, `children` | `cn` | `pressed`> & { active?: boolean; text: string };

export const TabButton = (props: TabButtonProps) => <TabButtonView {...useTabButtonState(props)} />;
