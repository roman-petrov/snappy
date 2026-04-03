import type { useChatState } from "./Chat.state";

import { Page } from "../../components";

export type ChatViewProps = ReturnType<typeof useChatState>;

export const ChatView = ({ agent }: ChatViewProps) =>
  agent === undefined ? undefined : (
    <Page back title={agent.title}>
      <agent.View />
    </Page>
  );
