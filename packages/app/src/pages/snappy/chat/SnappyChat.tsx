import { useSnappyChatState } from "./SnappyChat.state";
import { SnappyChatView } from "./SnappyChat.view";

export type SnappyChatProps = { presetId: string };

export const SnappyChat = (props: SnappyChatProps) => <SnappyChatView {...useSnappyChatState(props)} />;
