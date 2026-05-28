/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable no-continue */
import type { TypeWriterSpeed } from "@snappy/domain";

import { Html } from "@snappy/browser";
import { _ } from "@snappy/core";

import { HtmlReveal, type Slot } from "./HtmlReveal";
import { Shell } from "./Shell";
import { TextMetrics, type WidthCache } from "./TextMetrics";
import styles from "./TypeWriter.module.scss";

export const TypeWriter = () => {
  const pixelsPerSecond = { fast: 0x4_00, medium: 0x4_00, slow: 0x1_00 } as const;
  const speedPixelsPerSecond = (speed: TypeWriterSpeed) => pixelsPerSecond[speed];
  const partialPaintStep = (partial: number) => _.round(partial * 2, 0) / 2;
  let host: HTMLElement | undefined;
  let caretElement: HTMLSpanElement | undefined;
  let body: HTMLElement | undefined;
  let previousVisible = ``;
  let revealedPx = 0;
  let totalPx = 0;
  let speed: TypeWriterSpeed = `medium`;
  let busy = false;
  let waiting = false;
  let frame = 0;
  let clockLast = 0;
  let lastPaintedFull = -1;
  let lastPaintedPartial = -1;
  let contentMount: HTMLElement | undefined;
  let mountSignature = ``;
  let widthCache: undefined | WidthCache;
  let textSlots: readonly Slot[] | undefined;
  let pendingPrefixGraphemes = 0;
  let pendingOldAtPrefixPx = 0;
  let pendingVisibleUnchanged = false;
  const listeners = new Set<(busy: boolean) => void>();
  const caretActive = () => busy || waiting;

  const placeCaret = () => {
    if (caretElement === undefined || contentMount === undefined) {
      return;
    }

    const partial = contentMount.querySelector(`[data-tw-partial]`);
    if (partial !== null) {
      if (caretElement.previousSibling === partial) {
        return;
      }
      partial.after(caretElement);

      return;
    }

    if (textSlots !== undefined) {
      for (let index = textSlots.length - 1; index >= 0; index -= 1) {
        const slot = textSlots.at(index);
        if (slot === undefined) {
          continue;
        }
        if (slot.node.data.trim().length > 0) {
          if (caretElement.previousSibling === slot.node) {
            return;
          }
          slot.node.after(caretElement);

          return;
        }
      }
    }

    if (caretElement.parentElement === contentMount && caretElement === contentMount.lastElementChild) {
      return;
    }
    contentMount.append(caretElement);
  };

  const updateCaret = () => {
    if (caretElement !== undefined) {
      caretElement.classList.toggle(styles.hidden, !caretActive());
    }
  };

  const setBusy = (next: boolean) => {
    if (busy === next) {
      return;
    }
    busy = next;
    updateCaret();
    for (const fn of listeners) {
      fn(next);
    }
  };

  const stopLoop = () => {
    if (frame !== 0) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const ensureCaret = () => {
    if (caretElement === undefined) {
      caretElement = document.createElement(`span`);
      caretElement.className = styles.root;
    }
  };

  const resetMount = () => {
    caretElement?.remove();
    contentMount = undefined;
    mountSignature = ``;
    textSlots = undefined;
  };

  const revealSlice = () =>
    widthCache === undefined
      ? { full: 0, partial: 0, totalPx: 0 }
      : TextMetrics.countAtPx(widthCache, Math.min(revealedPx, totalPx));

  const applyReveal = () => {
    if (contentMount === undefined || widthCache === undefined || textSlots === undefined) {
      return;
    }

    const slice = revealSlice();
    HtmlReveal.apply(textSlots, slice);
    lastPaintedFull = slice.full;
    lastPaintedPartial = slice.partial;
    placeCaret();
    updateCaret();
  };

  const buildWidthCache = () => {
    if (contentMount === undefined || body === undefined) {
      return;
    }

    caretElement?.remove();
    contentMount.style.visibility = `hidden`;
    contentMount.innerHTML = Shell.html(body);
    const { slots } = HtmlReveal.collect(contentMount);
    textSlots = slots;
    const nextWidthCache = TextMetrics.buildWidthCache(contentMount, slots);
    widthCache = nextWidthCache;
    const { totalPx: cacheTotalPx } = nextWidthCache;
    totalPx = cacheTotalPx;

    if (pendingPrefixGraphemes > 0) {
      const newAtPrefix = TextMetrics.pxAt(nextWidthCache, pendingPrefixGraphemes);

      if (pendingVisibleUnchanged && pendingOldAtPrefixPx > 0) {
        revealedPx =
          revealedPx >= pendingOldAtPrefixPx ? newAtPrefix : (revealedPx / pendingOldAtPrefixPx) * newAtPrefix;
      } else {
        revealedPx = Math.min(revealedPx, newAtPrefix);
      }

      pendingPrefixGraphemes = 0;
      pendingOldAtPrefixPx = 0;
      pendingVisibleUnchanged = false;
    }

    revealedPx = Math.min(revealedPx, totalPx);
    applyReveal();
    contentMount.style.visibility = ``;
  };

  const paint = (): boolean => {
    if (host === undefined || body === undefined) {
      return false;
    }
    ensureCaret();

    const signature = Shell.signature(body);
    if (contentMount === undefined || mountSignature !== signature) {
      Shell.mount(host, body);
      contentMount = host.querySelector(`[data-tw-content]`) ?? undefined;
      mountSignature = signature;
      widthCache = undefined;
      textSlots = undefined;
      placeCaret();
    }

    if (contentMount === undefined) {
      return false;
    }

    if (widthCache === undefined) {
      buildWidthCache();
    }

    return widthCache !== undefined;
  };

  const paintWaiting = () => {
    if (host === undefined) {
      return;
    }
    ensureCaret();
    resetMount();
    if (caretElement !== undefined) {
      host.replaceChildren(caretElement);
    }
    updateCaret();
  };

  const tick = (now: number) => {
    if (host === undefined || body === undefined || widthCache === undefined) {
      stopLoop();

      return;
    }

    const elapsed = Math.max(0, now - clockLast);
    clockLast = now;
    revealedPx = Math.min(revealedPx + (elapsed / _.second) * speedPixelsPerSecond(speed), totalPx);

    const { full, partial } = revealSlice();
    if (full !== lastPaintedFull || partialPaintStep(partial) !== partialPaintStep(lastPaintedPartial)) {
      applyReveal();
    }

    if (revealedPx >= totalPx) {
      stopLoop();
      setBusy(false);

      return;
    }

    frame = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (frame !== 0 || host === undefined || revealedPx >= totalPx) {
      return;
    }
    clockLast = performance.now();
    frame = requestAnimationFrame(tick);
  };

  const attach = (element: HTMLElement) => {
    if (host === element) {
      return;
    }
    host = element;
    resetMount();
    if (body === undefined) {
      paintWaiting();
    } else {
      paint();
    }
    if (busy) {
      startLoop();
    }
  };

  const push = (nextHtml: string) => {
    const safeHtml = Html.sanitize(nextHtml);
    const newBody = HtmlReveal.parse(safeHtml);
    const { slots: newSlots } = HtmlReveal.collect(newBody);
    const newVisible = HtmlReveal.plain(newSlots);
    const prefixGraphemes = HtmlReveal.prefix(previousVisible, newVisible);
    const visibleUnchanged = previousVisible === newVisible && previousVisible !== ``;
    const cacheBeforePush = widthCache;

    if (previousVisible === ``) {
      revealedPx = 0;
      pendingPrefixGraphemes = 0;
      pendingOldAtPrefixPx = 0;
      pendingVisibleUnchanged = false;
    } else if (cacheBeforePush !== undefined) {
      if (prefixGraphemes === 0) {
        revealedPx = 0;
        pendingPrefixGraphemes = 0;
        pendingOldAtPrefixPx = 0;
        pendingVisibleUnchanged = false;
      } else {
        pendingPrefixGraphemes = prefixGraphemes;
        pendingOldAtPrefixPx = TextMetrics.pxAt(cacheBeforePush, prefixGraphemes);
        pendingVisibleUnchanged = visibleUnchanged;
      }
    }

    body = newBody;
    previousVisible = newVisible;
    widthCache = undefined;
    totalPx = 0;
    lastPaintedFull = -1;
    lastPaintedPartial = -1;
    textSlots = undefined;

    const ready = host === undefined ? false : paint();
    if (ready && revealedPx >= totalPx) {
      setBusy(false);
    } else {
      setBusy(true);
      startLoop();
    }
  };

  const subscribe = (listener: (state: boolean) => void) => {
    listeners.add(listener);
    listener(busy);

    return () => {
      listeners.delete(listener);
    };
  };

  const destroy = () => {
    stopLoop();
    listeners.clear();
    if (host !== undefined) {
      host.replaceChildren();
    }
    caretElement = undefined;
    host = undefined;
    body = undefined;
    resetMount();
    previousVisible = ``;
    revealedPx = 0;
    totalPx = 0;
    widthCache = undefined;
    lastPaintedFull = -1;
    lastPaintedPartial = -1;
    busy = false;
    waiting = false;
  };

  return {
    attach,
    get busy() {
      return busy;
    },
    destroy,
    push,
    get speed() {
      return speed;
    },
    set speed(value: TypeWriterSpeed) {
      if (value === speed) {
        return;
      }
      speed = value;
      updateCaret();
      if (busy && frame === 0 && host !== undefined) {
        startLoop();
      }
    },
    subscribe,
    get waiting() {
      return waiting;
    },
    set waiting(value: boolean) {
      if (waiting === value) {
        return;
      }
      waiting = value;
      if (host !== undefined) {
        if (body === undefined) {
          paintWaiting();
        } else {
          updateCaret();
        }
      }
    },
  };
};

export type TypeWriter = ReturnType<typeof TypeWriter>;
