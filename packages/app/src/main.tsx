/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";
import { Bot, Newspaper, Sparkles } from "lucide-react";

import { AppBase } from "./AppBase";
import { t } from "./core";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({
  base: AppBase.url(``),
  layerOf: pattern =>
    new Set([`/`, `agents`, `feed`]).has(pattern)
      ? undefined
      : new Set([`email-verified`, `forgot-password`, `login`, `register`, `reset-password`]).has(pattern)
        ? `flip`
        : `cover`,
  routes: Routes,
  signedIn: $signedIn,
  tabs: [
    { color: `accentOrange`, icon: Newspaper, id: `feed`, label: t(`tabs.feed.label`), path: Routes.feed },
    { color: `accentIndigo`, icon: Sparkles, id: `snappy`, label: t(`tabs.snappy.label`), path: Routes.$.home },
    { color: `accentFuchsia`, icon: Bot, id: `agents`, label: t(`tabs.agents.label`), path: Routes.agents },
  ],
});
