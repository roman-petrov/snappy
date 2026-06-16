import { useSnappyChatState } from "./SnappyChat.state";
import { SnappyChatView } from "./SnappyChat.view";

export const SnappyChat = () => <SnappyChatView {...useSnappyChatState()} />;
