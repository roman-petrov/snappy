import type { AiImageQuality } from "@snappy/ai";
import type { TrpcClient, TrpcOutputs } from "@snappy/app-server-api";
import type { TypeWriterSpeed } from "@snappy/domain";

import { Store } from "@snappy/core";
import { DataHook } from "@snappy/store";

import { AgentAiFromSettings } from "../core/AgentAiFromSettings";

export type UserSettings = TrpcOutputs[`user`][`settings`][`get`];

export type UserSettingsPatch = {
  aiTunnelDirect?: boolean;
  aiTunnelKey?: string;
  llmChatModel?: string;
  llmImageModel?: string;
  llmImageQuality?: AiImageQuality;
  llmSpeechRecognitionModel?: string;
  llmVisionModel?: string;
  typeWriterSpeed?: false | TypeWriterSpeed;
};

export const UserSettings = (trpc: TrpcClient) => {
  const $store = Store<undefined | UserSettings>(undefined);
  const $aiConfig = $store.map(settings => (settings === undefined ? undefined : AgentAiFromSettings(settings)));
  const patch = async (delta: UserSettingsPatch) => $store.set(await trpc.user.settings.set.mutate(delta));
  const load = async () => $store.set(await trpc.user.settings.get.query());
  const clear = () => $store.set(undefined);
  const settings = DataHook($store, value => ({ patch, settings: value }));
  const aiConfig = DataHook($aiConfig, value => value);

  return { aiConfig, clear, load, settings };
};
