import type { AiChatAssistantMessage, AiChatInput as DomainAiChatInput, ImageGenerationOptions } from "@snappy/ai";
import type { Action } from "@snappy/core";
import type { FunctionComponent } from "react";

export type AgentCard = { description: string; emoji: string; group: AgentGroupId; id: string; title: string };

export type AgentChatInput = DomainAiChatInput | string;

export type AgentChatOutput = AiChatAssistantMessage | string;

export type AgentGroupId = `audio` | `lab` | `text` | `visual`;

export type AgentHostTools = {
  ask: <TResult, TProps extends object = object>(request: AgentUiRequest<TResult, TProps>) => Promise<TResult>;
  chat: (input: AgentChatInput) => Promise<AgentChatOutput>;
  image: (prompt: string, options: ImageGenerationOptions) => Promise<Uint8Array>;
  speechRecognition: (file: File) => Promise<string>;
};

export type AgentInfo = { description: string; emoji: string; group: AgentGroupId; title: string };

export type AgentInstance = { meta: AgentInfo; start: (input: AgentStartInput) => Action };

export type AgentLocale = `en` | `ru`;

export type AgentModule = (locale: AgentLocale) => AgentInstance;

export type AgentStartInput = {
  feed: ChatFeedClient;
  hostTools: AgentHostTools;
  isStopped: () => boolean;
  maxImagePromptLength: number;
  maxSpeechFileMegaBytes: number;
  onDone: (input: { failed: boolean }) => Promise<void>;
};

export type AgentTools = Omit<AgentHostTools, `ask` | `chat`> & {
  chat: (prompt: string) => Promise<string>;
  vectorize: (input: { imageBase64: string }) => Promise<string>;
};

export type AgentToolStepKind = `chat` | `image` | `showStaticForm` | `speechRecognition` | `vectorize`;

export type AgentUiProps<TResult> = { onReject: () => void; onResolve: (value: TResult) => void };

export type AgentUiRequest<TResult, TProps extends object = object> = {
  component: FunctionComponent<AgentUiProps<TResult> & TProps>;
  props: TProps;
};

export type ChatFeedClient = {
  append: (message: ChatFeedMessageDraft) => string;
  clear: () => void;
  list: () => ChatFeedMessage[];
  patch: (
    id: string,
    patch: Partial<Extract<ChatFeedMessage, { type: `tool` }>>,
  ) => Extract<ChatFeedMessage, { type: `tool` }>;
  remove: (id: string) => void;
  subscribe: (listener: (messages: ChatFeedMessage[]) => void) => () => void;
};

export type ChatFeedMessage =
  | {
      cost?: number;
      id: string;
      status: `done` | `error` | `running`;
      text: string;
      tool: AgentToolStepKind;
      type: `tool`;
    }
  | { generationPrompt: string; html: string; id: string; type: `text` }
  | { generationPrompt: string; id: string; src: string; type: `image` }
  | { id: string; role: `assistant` | `system` | `tool` | `user`; text: string; type: `llm` }
  | { id: string; text: string; type: `start` };

export type ChatFeedMessageDraft = DropId<ChatFeedMessage>;

type DropId<TValue> = TValue extends { id: string } ? Omit<TValue, `id`> : never;
