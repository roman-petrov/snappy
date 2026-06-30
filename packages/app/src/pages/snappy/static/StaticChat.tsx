import { useStaticChatState } from "./StaticChat.state";
import { StaticChatView } from "./StaticChat.view";

export type StaticChatProps = { presetId: string };

export const StaticChat = (props: StaticChatProps) => <StaticChatView {...useStaticChatState(props)} />;
