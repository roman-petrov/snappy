import { ModelDefault } from "./core-model";
import { AiModelChatCatalog, AiModelEmbedderCatalog, AiModelImageCatalog, AiModelSpeechCatalog } from "./models";

const catalog = [
  ...AiModelChatCatalog,
  ...AiModelEmbedderCatalog,
  ...AiModelImageCatalog,
  ...AiModelSpeechCatalog,
] as const;

const capabilities = (name: string) => catalog.find(entry => entry.name === name)?.capabilities;

const items = catalog.map(({ capabilities: caps, name, source, type }) => ({ capabilities: caps, name, source, type }));

const resolve = (modelId: string) =>
  catalog.find(entry => entry.matches(modelId) && entry.type === `chat`) ?? ModelDefault;

export const AiModels = { capabilities, items };

export const AiModel = { resolve };
