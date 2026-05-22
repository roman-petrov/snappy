import type { TypeWriterSpeed } from "@snappy/domain";

import type { AiStreamTheme } from "../themes";

import { useAiStreamerState } from "./AiStreamer.state";
import { AiStreamerView } from "./AiStreamer.view";

export type AiStreamerProps = {
  onTailBusyChange?: (busy: boolean) => void;
  streaming: boolean;
  text: string;
  theme: AiStreamTheme;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AiStreamer = (props: AiStreamerProps) => <AiStreamerView {...useAiStreamerState(props)} />;
