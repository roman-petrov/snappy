// cspell:words lowlight midtone
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import type { Action } from "@snappy/core";

import { WebGl } from "@snappy/browser";

import type { ResolvedTheme } from "./Theme";

import { $fog } from "../Store";
import { Fog, FogShader } from "../web-gl";

export const ThemeFog = (resolveTheme: () => ResolvedTheme) => {
  let fogHost: HTMLElement | undefined;
  let stopFog: Action | undefined;

  const detachFogHost = () => {
    fogHost?.remove();
    fogHost = undefined;
  };

  const attachFogHost = () => {
    if (fogHost?.isConnected === true) {
      return fogHost;
    }

    const element = document.createElement(`div`);
    element.setAttribute(`aria-hidden`, `true`);
    Object.assign(element.style, { inset: `0`, pointerEvents: `none`, position: `fixed`, zIndex: `-1` });
    document.body.prepend(element);
    fogHost = element;

    return element;
  };

  const sync = () => {
    const stop = stopFog;
    stopFog = undefined;
    stop?.();

    if (!$fog()) {
      detachFogHost();

      return;
    }

    const element = attachFogHost();
    const canvas = document.createElement(`canvas`);
    canvas.setAttribute(`aria-hidden`, `true`);
    const motion = { blurFactor: 0.5, speed: 2, zoom: 2 };

    const options = {
      dark: {
        ...motion,
        baseColor: 0x0a_0e_18_ff,
        highlightColor: 0x1a_2c_48_ff,
        lowlightColor: 0x0e_16_28_ff,
        midtoneColor: 0x12_20_38_ff,
      },
      light: {
        ...motion,
        baseColor: 0xc9_d9_ec_ff,
        highlightColor: 0xfd_fe_ff_ff,
        lowlightColor: 0x9f_b7_d2_ff,
        midtoneColor: 0xb8_cb_e1_ff,
      },
    };

    const nextStop = WebGl.runLoop({ canvas, shader: FogShader }, webgl =>
      Fog(element, options[resolveTheme()], webgl),
    );
    if (nextStop !== undefined) {
      stopFog = nextStop;
    }
  };

  $fog.subscribe(sync);

  return { sync };
};

export type ThemeFog = ReturnType<typeof ThemeFog>;
