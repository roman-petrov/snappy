// cspell:word vanta lowlight midtone
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import aos from "aos";
import "aos/dist/aos.css";

const applyTheme = (theme: string) => (document.documentElement.dataset[`theme`] = theme);

applyTheme(`light`);

type VantaEffect = { destroy: () => void };

let vantaEffect: undefined | VantaEffect;

const syncVanta = (): void => {
  if (vantaEffect !== undefined) {
    vantaEffect.destroy();
    vantaEffect = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#vanta-bg`);
  if (element === null) {
    return;
  }
  const three = window.THREE;
  const vanta = window.VANTA;

  vantaEffect = vanta.FOG({
    baseColor: 0x0a_0a_0c,
    blurFactor: 0.6,
    el: element,
    highlightColor: 0x1a_3d_42,
    lowlightColor: 0x0a_0a_0c,
    midtoneColor: 0x0d_1f_22,
    mouseControls: false,
    speed: 1,
    THREE: three,
    touchControls: false,
    zoom: 1.2,
  });
};

document.querySelector(`.logo`)?.addEventListener(`click`, clickEvent => {
  clickEvent.preventDefault();
  const next = document.documentElement.dataset[`theme`] === `dark` ? `light` : `dark`;
  applyTheme(next);
  requestAnimationFrame(syncVanta);
});

aos.init({ duration: 400, easing: `ease-out-cubic`, offset: 60, once: true });

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions */
declare global {
  interface Window {
    THREE: Record<string, unknown>;
    VANTA: { FOG: (options: Record<string, unknown>) => VantaEffect };
  }
}
/* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions */
