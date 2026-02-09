/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
import { Fog } from "./Fog.js";

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

const fogRef = { current: undefined as ReturnType<typeof Fog> | undefined };

const syncFog = (): void => {
  if (fogRef.current !== undefined) {
    fogRef.current.stop();
    fogRef.current = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#fog-bg`);
  if (element === null || !(element instanceof HTMLElement)) {
    return;
  }
  fogRef.current = Fog(element, { blurFactor: 0.5, speed: 2, zoom: 2 });
  fogRef.current.start();
};

document.querySelector(`.logo`)?.addEventListener(`click`, clickEvent => {
  clickEvent.preventDefault();
  const next = document.documentElement.dataset[`theme`] === `dark` ? `light` : `dark`;
  applyTheme(next);
  requestAnimationFrame(syncFog);
});

initScrollAnimations();
syncFog();
