/* eslint-disable functional/no-loop-statements */
/* eslint-disable unicorn/require-module-specifiers */
// cspell:word vanta lowlight midtone
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */

const applyTheme = (theme: string) => (document.documentElement.dataset[`theme`] = theme);

const initScrollAnimations = (): void => {
  const rootMargin = `60px 0px`;

  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(`scroll-visible`);
          observer.unobserve(entry.target);
        }
      }
    },
    { root: undefined, rootMargin, threshold: 0 },
  );

  for (const element of document.querySelectorAll(`[data-aos]`)) {
    const delay = element.getAttribute(`data-aos-delay`);
    if (delay !== null && element instanceof HTMLElement) {
      element.style.setProperty(`--aos-delay`, `${delay}ms`);
    }
    observer.observe(element);
  }
};

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

initScrollAnimations();

/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions */
declare global {
  interface Window {
    THREE: Record<string, unknown>;
    VANTA: { FOG: (options: Record<string, unknown>) => VantaEffect };
  }
}
/* eslint-enable @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions */

export {};
