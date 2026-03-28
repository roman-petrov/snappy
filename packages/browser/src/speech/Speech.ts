/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/// <reference types="dom-speech-recognition" />

/**
 * ? See:
 * ? https://stackoverflow.com/questions/35112561/speech-recognition-api-duplicated-phrases-on-android
 * ? https://www.npmjs.com/package/react-speech-recognition
 */
import { _, Browser } from "@snappy/core";

import { SpeechRecognizerDesktop } from "./SpeechRecognizerDesktop";
import { SpeechRecognizerMobile } from "./SpeechRecognizerMobile";

const global = globalThis as Record<string, unknown>;
const raw = global[`SpeechRecognition`] ?? global[`webkitSpeechRecognition`];

const recognize = _.isFunction(raw)
  ? (Browser.mobile(globalThis.navigator.userAgent) ? SpeechRecognizerMobile : SpeechRecognizerDesktop)(
      new (raw as unknown as new () => SpeechRecognition)(),
    )
  : undefined;

export const Speech = { recognize };
