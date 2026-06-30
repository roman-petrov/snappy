import type { TextCardProps } from "./TextCard";

import { useFeedItem } from "./hooks";

export const useTextCardState = (props: TextCardProps) => {
  const { content, model, prompt, typeWriterSpeed } = props;
  const { actions: artifactActions, complete, generation, remove, running } = useFeedItem({ ...props, type: `text` });
  const base = { artifactActions, onRemove: remove, theme: `chat` as const };

  const body = running
    ? {
        active: true as const,
        chatModel: model,
        generationKey: generation,
        onComplete: complete,
        prompt,
        typeWriterSpeed,
      }
    : { text: content };

  return { ...base, ...body };
};
