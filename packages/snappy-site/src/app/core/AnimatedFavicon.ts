/* eslint-disable init-declarations */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
const size = 32;
const center = size / 2;
const radius = 6.75;
const colors = [`#22d3ee`, `#8b5cf6`, `#f87171`] as const;
const circleCount = 3;
const phaseStep = 0.08;
let canvas: HTMLCanvasElement | undefined;
let context: CanvasRenderingContext2D | undefined;
let link: HTMLLinkElement | undefined;
let originalHref = ``;
let rafId: number | undefined;
let phase = 0;

const draw = () => {
  if (context === undefined || link === undefined || canvas === undefined) {
    return;
  }
  context.clearRect(0, 0, size, size);
  for (let index = 0; index < circleCount; index++) {
    const a = (index * (2 * Math.PI)) / circleCount + phase;
    context.beginPath();
    context.arc(center + radius * Math.cos(a), center + radius * Math.sin(a), radius, 0, 2 * Math.PI);
    context.fillStyle = colors[index] ?? colors[0];
    context.fill();
  }
  const dataUrl = canvas.toDataURL(`image/png`);
  const next = document.createElement(`link`);
  next.rel = `icon`;
  next.type = `image/png`;
  next.href = dataUrl;
  link.parentNode?.replaceChild(next, link);
  link = next;
};

const tick = () => {
  phase += phaseStep;
  draw();
  rafId = requestAnimationFrame(tick);
};

const start = () => {
  if (rafId !== undefined) {
    return;
  }
  const element = document.querySelector<HTMLLinkElement>(`link[rel="icon"]`);
  if (element === null) {
    return;
  }
  originalHref = element.href;
  link = document.createElement(`link`);
  link.rel = `icon`;
  link.type = `image/png`;
  element.parentNode?.replaceChild(link, element);
  canvas = document.createElement(`canvas`);
  canvas.width = size;
  canvas.height = size;
  context = canvas.getContext(`2d`) ?? undefined;
  if (context === undefined) {
    return;
  }
  phase = 0;
  rafId = requestAnimationFrame(tick);
};

const stop = () => {
  if (rafId !== undefined) {
    cancelAnimationFrame(rafId);
    rafId = undefined;
  }
  if (link !== undefined && originalHref !== ``) {
    const restored = document.createElement(`link`);
    restored.rel = `icon`;
    restored.type = `image/svg+xml`;
    restored.href = originalHref;
    link.parentNode?.replaceChild(restored, link);
  }
  link = undefined;
  canvas = undefined;
  context = undefined;
  originalHref = ``;
};

export const AnimatedFavicon = { start, stop };
