/* eslint-disable @typescript-eslint/no-meaningless-void-operator */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import { effect } from "@preact/signals";

import { $serverMode, $theme } from "../Store";
import { Fog } from "./Fog";

export const themes = [`light`, `dark`] as const;

export type Theme = (typeof themes)[number];

const fogContainerId = `fog-bg`;
const fogOptions = { blurFactor: 0.5, speed: 2, zoom: 2 };
let afterChange: (() => void) | undefined;
const fogRef: { current: Fog | undefined } = { current: undefined };

const syncFog = () => {
  if (fogRef.current !== undefined) {
    fogRef.current.stop();
    fogRef.current = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#${fogContainerId}`);
  if (element instanceof HTMLElement) {
    fogRef.current = Fog(element, fogOptions);
    fogRef.current.start();
  }
};

const apply = (theme: Theme) => {
  document.documentElement.dataset[`theme`] = theme;
  void afterChange?.();
};

const init = (options?: { theme?: Theme }) => {
  const div = document.createElement(`div`);
  div.id = fogContainerId;
  div.setAttribute(`aria-hidden`, `true`);
  document.body.prepend(div);
  if (document.querySelector(`#${fogContainerId}`) instanceof HTMLElement) {
    afterChange = () => {
      void requestAnimationFrame(syncFog);
    };
  }

  effect(() => apply($theme.value));
  if ($serverMode.value && options?.theme !== undefined) {
    $theme.value = options.theme;
  }
  apply($theme.value);
};

const toggle = () => {
  $theme.value = $theme.value === `dark` ? `light` : `dark`;
};

export const Theme = { init, toggle };
