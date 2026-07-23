import type { Ref } from "react";

import { useStreamHtmlState } from "./StreamHtml.state";
import { StreamHtmlView } from "./StreamHtml.view";

export type StreamHtmlProps = { cn?: string; html: string; tailHostRef?: Ref<HTMLDivElement | null> };

export const StreamHtml = (props: StreamHtmlProps) => <StreamHtmlView {...useStreamHtmlState(props)} />;
