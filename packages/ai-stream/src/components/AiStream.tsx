import type { AiOptions } from "@snappy/ai";
import type { TypeWriterSpeed } from "@snappy/domain";

import type { AiStreamTheme } from "../themes";

import { useAiStreamState } from "./AiStream.state";
import { AiStreamView } from "./AiStream.view";

export type AiStreamProps = {
  active?: boolean;
  aiOptions?: AiOptions;
  generationKey?: number;
  model?: string;
  onComplete?: (text: string) => void;
  prompt?: string;
  stream?: AsyncIterable<string>;
  theme: AiStreamTheme;
  typeWriterSpeed?: TypeWriterSpeed;
};

export const AiStream = (props: AiStreamProps) => <AiStreamView {...useAiStreamState(props)} />;
