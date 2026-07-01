/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";
import { Newspaper, Settings, Sparkles } from "lucide-react";

import { AppBase } from "./AppBase";
import { t } from "./core";
import { $data } from "./data";
import { Routes } from "./Routes";

startApp({
  base: AppBase.url(``),
  layerOf: pattern =>
    new Set([`/`, `feed`, `settings`]).has(pattern)
      ? undefined
      : new Set([`email-verified`, `forgot-password`, `login`, `register`, `reset-password`]).has(pattern)
        ? `flip`
        : `cover`,
  routes: Routes,
  signedIn: $data.auth.read,
  tabs: [
    { color: `accentOrange`, icon: Newspaper, id: `feed`, label: t(`tabs.feed.label`), path: Routes.feed },
    { color: `accentIndigo`, icon: Sparkles, id: `snappy`, label: t(`tabs.snappy.label`), path: Routes.$.home },
    {
      color: `accentFuchsia`,
      icon: Settings,
      id: `settings`,
      label: t(`tabs.settings.label`),
      path: Routes.settings.root,
    },
  ],
});
