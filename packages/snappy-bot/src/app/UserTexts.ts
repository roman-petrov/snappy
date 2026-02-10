/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import { Time } from "@snappy/core";

export const UserTexts = () => {
  const texts = new Map<number, string>();
  const maxTextCount = 1000;

  const set = (userId: number, text: string) => {
    texts.set(userId, text);
  };

  const get = (userId: number) => texts.get(userId);

  const clear = (userId: number) => {
    texts.delete(userId);
  };

  const cleanup = () => {
    if (texts.size > maxTextCount) {
      texts.clear();
    }
  };

  setInterval(cleanup, Time.hourInMs);

  return { clear, get, set };
};

export type UserTexts = ReturnType<typeof UserTexts>;
