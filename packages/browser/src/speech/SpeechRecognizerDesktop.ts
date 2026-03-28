/* jscpd:ignore-start */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import type { SpeechRecognizer } from "./Types";

export const SpeechRecognizerDesktop: SpeechRecognizer = recognition => options => {
  let accumulatedFinals = ``;
  const pending: { promise?: Promise<void>; resolve?: () => void } = {};
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = options.lang === `ru` ? `ru-RU` : `en-US`;
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = ``;
    for (let index = event.resultIndex; index < event.results.length; index++) {
      const item = event.results[index];
      if (item !== undefined) {
        const piece = item[0]?.transcript ?? ``;
        if (item.isFinal) {
          accumulatedFinals += piece;
        } else {
          interim += piece;
        }
      }
    }
    options.onText(accumulatedFinals + interim);
  };
  recognition.onend = () => {
    pending.resolve?.();
    pending.resolve = undefined;
    pending.promise = undefined;
  };
  recognition.start();

  return async () => {
    if (pending.promise !== undefined) {
      return pending.promise;
    }
    pending.promise = new Promise(resolve => {
      pending.resolve = resolve;
      recognition.stop();
    });

    return pending.promise;
  };
};
/* jscpd:ignore-end */
