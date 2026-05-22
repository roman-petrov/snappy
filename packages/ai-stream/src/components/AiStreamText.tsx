import { AiStreamer, type AiStreamerProps } from "./AiStreamer";

export type AiStreamTextProps = Pick<AiStreamerProps, `text` | `theme`>;

export const AiStreamText = (props: AiStreamTextProps) => <AiStreamer {...props} streaming={false} />;
