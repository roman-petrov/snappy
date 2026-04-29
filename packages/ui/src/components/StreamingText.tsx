import type { Typography } from "../$";

import { useStreamingTextState } from "./StreamingText.state";
import { StreamingTextView } from "./StreamingText.view";

export type StreamingTextProps = { chunks: AsyncIterable<string>; typography?: Typography };

export const StreamingText = (props: StreamingTextProps) => <StreamingTextView {...useStreamingTextState(props)} />;
