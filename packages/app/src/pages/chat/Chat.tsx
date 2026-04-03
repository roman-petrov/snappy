import { useChatState } from "./Chat.state";
import { ChatView } from "./Chat.view";

export const Chat = () => <ChatView {...useChatState()} />;
