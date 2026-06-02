import { TranslateFunction } from "../core";
import { en } from "./en";
import { ru } from "./ru";

export const t = TranslateFunction({ en, ru } as const);
