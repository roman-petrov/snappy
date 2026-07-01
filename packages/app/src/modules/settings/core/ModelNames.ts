import { type AiModelItem, AiModels, type AiModelType } from "@snappy/ai";

const forType = (type: AiModelType, filter?: (model: AiModelItem) => boolean) =>
  AiModels.items
    .filter(entry => entry.type === type && (filter === undefined || filter(entry)))
    .map(entry => entry.name);

export const ModelNames = { forType };
