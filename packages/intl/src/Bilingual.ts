import type { Locale } from "./Locale";

export type Bilingual = readonly [en: string, ru: string];

export type BilingualNamed = { en: string; ru: string };

const pick = (locale: Locale, value: Bilingual): string => (locale === `en` ? value[0] : value[1]);
const binary = (locale: Locale, value: boolean, on: Bilingual, off: Bilingual) => pick(locale, value ? on : off);
const named = (locale: Locale, value: BilingualNamed) => pick(locale, [value.en, value.ru]);
const running = (locale: Locale, isRunning: boolean, label: Bilingual) => (isRunning ? pick(locale, label) : ``);

const status = (locale: Locale, isRunning: boolean, runningLabel: Bilingual, doneLabel: Bilingual) =>
  pick(locale, isRunning ? runningLabel : doneLabel);

export const Bilingual = { binary, named, pick, running, status };
