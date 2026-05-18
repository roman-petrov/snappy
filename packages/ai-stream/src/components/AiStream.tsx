import type { Color, Typography } from "@snappy/ui";

import { useAiStreamState } from "./AiStream.state";
import { AiStreamView } from "./AiStream.view";

export type AiStreamProps = {
  color?: Color;
  onHtml?: (html: string) => void;
  stream: AsyncIterable<string> | string;
  typography?: Typography;
};

export const AiStream = (props: AiStreamProps) => <AiStreamView {...useAiStreamState(props)} />;
