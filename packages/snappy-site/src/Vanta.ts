import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

const init = () => {
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  try {
    FOG({
      baseColor: 0x0a_0a_0c,
      blurFactor: 0.6,
      el: `#vanta-bg`,
      highlightColor: 0x1a_3d_42,
      lowlightColor: 0x0a_0a_0c,
      midtoneColor: 0x0d_1f_22,
      mouseControls: false,
      speed: 1,
      THREE,
      touchControls: false,
      zoom: 1.2,
    });
  } catch {
    /* WebGL fallback: keep static gradient */
  }
};

export const Vanta = { init };
