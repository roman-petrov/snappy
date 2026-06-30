import type { PresetFlowPageProps, SnappyFlowDraft } from "../core";

import { useSnappyFlowPageState } from "./SnappyFlowPage.state";
import { SnappyFlowPageView } from "./SnappyFlowPage.view";

export type SnappyFlowPageProps = PresetFlowPageProps & { draft?: SnappyFlowDraft };

export const SnappyFlowPage = (props: SnappyFlowPageProps) => <SnappyFlowPageView {...useSnappyFlowPageState(props)} />;
