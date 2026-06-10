import type { TextCardProps } from "./TextCard";

import { useFeedItem } from "../hooks";

export const useTextCardState = (props: TextCardProps) => {
  const { aiOptions, content, model, prompt, typeWriterSpeed } = props;
  const { actions: artifactActions, complete, generation, remove, running } = useFeedItem({ ...props, type: `text` });

  return {
    artifactActions,
    onRemove: remove,
    theme: `chat` as const,
    ...(running
      ? { active: true, aiOptions, generationKey: generation, model, onComplete: complete, prompt, typeWriterSpeed }
      : { text: content }),
  };
};
