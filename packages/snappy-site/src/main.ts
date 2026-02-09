import AOS from "aos";
import "aos/dist/aos.css";

const applyTheme = (theme: string): void => {
  document.documentElement.dataset[`theme`] = theme;
};

applyTheme(`light`);

type VantaEffect = { destroy: () => void };

let vantaEffect: null | VantaEffect = null;

const syncVanta = (): void => {
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#vanta-bg`);
  if (!element) {
    return;
  }
  const { THREE, VANTA } = window;
  if (!THREE?.WebGLRenderer || !VANTA?.FOG) {
    return;
  }
  try {
    vantaEffect = VANTA.FOG({
      baseColor: 0x0a_0a_0c,
      blurFactor: 0.6,
      el: element,
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
    /* WebGL fallback */
  }
};

document.querySelector(`.logo`)?.addEventListener(`click`, event_ => {
  event_.preventDefault();
  const next = document.documentElement.dataset[`theme`] === `dark` ? `light` : `dark`;
  applyTheme(next);
  requestAnimationFrame(syncVanta);
});

AOS.init({ duration: 400, easing: `ease-out-cubic`, offset: 60, once: true });
