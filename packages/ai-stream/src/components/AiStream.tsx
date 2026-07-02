import type { AiChatMessage, AiChatModel } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";

import type { AiStreamTheme } from "../themes";

import { useAiStreamState } from "./AiStream.state";
import { AiStreamView } from "./AiStream.view";

export type AiStreamProps =
  | (AiStreamPropsBase & { messages: AiChatMessage[]; stream?: never })
  | (AiStreamPropsBase & { messages?: never; stream: AsyncIterable<string> });

type AiStreamPropsBase = {
  active?: boolean;
  chatModel?: AiChatModel;
  generationKey?: number;
  onComplete?: (text: string) => void;
  theme: AiStreamTheme;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AiStream = (props: AiStreamProps) => <AiStreamView {...useAiStreamState(props)} />;
