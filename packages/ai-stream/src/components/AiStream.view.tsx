import type { useAiStreamState } from "./AiStream.state";

import { AiStreamer } from "./AiStreamer";

export type AiStreamViewProps = ReturnType<typeof useAiStreamState>;

export const AiStreamView = (props: AiStreamViewProps) => <AiStreamer {...props} />;
