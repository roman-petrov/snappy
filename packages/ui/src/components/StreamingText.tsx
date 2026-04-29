import type { Color, Typography } from "../$";

import { useStreamingTextState } from "./StreamingText.state";
import { StreamingTextView } from "./StreamingText.view";

export type StreamingTextProps = { color?: Color; stream: AsyncIterable<string>; typography?: Typography };

export const StreamingText = (props: StreamingTextProps) => <StreamingTextView {...useStreamingTextState(props)} />;
