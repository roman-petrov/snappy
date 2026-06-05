/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable no-continue */
import type { TypeWriterSpeed } from "@snappy/domain";

import { _ } from "@snappy/core";

import styles from "./TypeWriter.module.scss";

type BodyShell =
  | { code: HtmlAttributes; inner: string; kind: `pre`; pre: HtmlAttributes }
  | { inner: string; kind: `prePlain`; pre: HtmlAttributes }
  | { kind: `void`; outer: HtmlAttributes; tag: string };

type HtmlAttributes = { className?: string; style?: string };

type RevealSlice = { full: number; partial: number };

type Slot = { end: number; graphemes: readonly string[]; node: Text; start: number; text: string };

type WidthCache = { cumulative: Float32Array; totalPx: number };

export const TypeWriter = () => {
  const segmenter = new Intl.Segmenter();
  const partialSpans = new Map<Text, HTMLSpanElement>();
  const voidTags = new Set([`br`, `hr`, `img`]);
  const pixelsPerSecond = { fast: 0x4_00, medium: 0x2_00, slow: 0x1_00 } as const;
  let host: HTMLElement | undefined;
  let caretElement: HTMLSpanElement | undefined;
  let body: HTMLElement | undefined;
  let previousVisible = ``;
  let revealedPx = 0;
  let totalPx = 0;
  let speed: TypeWriterSpeed = `medium`;
  let animating = false;
  let waiting = false;
  let pendingId = 0;
  let pendingResolve: ((finished: boolean) => void) | undefined;
  let frame = 0;
  let clockLast = 0;
  let lastPaintedFull = -1;
  let lastPaintedPartial = -1;
  let contentMount: HTMLElement | undefined;
  let mountedSignature = ``;
  let widthCache: undefined | WidthCache;
  let textSlots: readonly Slot[] | undefined;
  let pendingPrefixGraphemes = 0;
  let pendingOldAtPrefixPx = 0;
  let pendingVisibleUnchanged = false;
  let partialCaretAnchor: HTMLElement | undefined;
  const graphemes = (source: string) => [...segmenter.segment(source)].map(part => part.segment);

  const settlePending = (finished: boolean) => {
    pendingResolve?.(finished);
    pendingResolve = undefined;
  };

  const removePartialAfter = (node: Text) => {
    const span = partialSpans.get(node);
    if (span === undefined) {
      return;
    }
    span.remove();
    partialSpans.delete(node);
    if (partialCaretAnchor === span) {
      partialCaretAnchor = undefined;
    }
  };

  const applyPartialAfter = (node: Text, grapheme: string, widthPx: number) => {
    let span = partialSpans.get(node);
    if (span === undefined) {
      span = document.createElement(`span`);
      span.className = styles.partial;
      node.after(span);
      partialSpans.set(node, span);
    }
    span.style.width = _.px(widthPx);
    span.textContent = grapheme;
    partialCaretAnchor = span;
  };

  const collect = (root: ParentNode) => {
    const slots: Slot[] = [];
    let total = 0;

    const visit = (node: Node) => {
      if (node instanceof Text) {
        const text = node.textContent;
        const parts = graphemes(text);
        slots.push({ end: total + parts.length, graphemes: parts, node, start: total, text });
        total += parts.length;

        return;
      }
      for (const child of node.childNodes) {
        visit(child);
      }
    };

    visit(root);

    return slots;
  };

  const prefix = (left: string, right: string) => {
    if (left === right) {
      return graphemes(left).length;
    }

    const a = graphemes(left);
    const b = graphemes(right);
    const max = Math.min(a.length, b.length);

    return _.gen(max, index => index).find(index => a[index] !== b[index]) ?? max;
  };

  const applyRevealToSlots = (slots: readonly Slot[], { full, partial }: RevealSlice) => {
    partialCaretAnchor = undefined;
    for (const slot of slots) {
      const parts = slot.graphemes;
      const { length } = parts;
      const localFull = Math.max(0, Math.min(length, full - slot.start));
      const showPartial = partial > 0 && full >= slot.start && full < slot.end;

      if (showPartial) {
        slot.node.textContent = parts.slice(0, localFull).join(``);
        applyPartialAfter(slot.node, parts[full - slot.start] ?? ``, partial);
      } else {
        removePartialAfter(slot.node);
        slot.node.textContent =
          localFull === length ? slot.text : localFull === 0 ? `` : parts.slice(0, localFull).join(``);
      }
    }
  };

  const utf16Offset = (parts: readonly string[], graphemeCount: number) => {
    if (graphemeCount <= 0) {
      return 0;
    }

    let offset = 0;
    let left = graphemeCount;

    for (const part of parts) {
      if (left <= 0) {
        break;
      }
      offset += part.length;
      left -= 1;
    }

    return offset;
  };

  const widths = (root: HTMLElement, slots: readonly Slot[], total: number): WidthCache => {
    if (total === 0) {
      return { cumulative: new Float32Array(0), totalPx: 0 };
    }

    const cumulative = new Float32Array(total);
    const range = document.createRange();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    if (!(walker.nextNode() instanceof Text)) {
      return { cumulative, totalPx: 0 };
    }

    _.gen(total, index => {
      let step = 0;
      for (const slot of slots) {
        if (index < slot.end) {
          const local = index - slot.start;
          const startOffset = utf16Offset(slot.graphemes, local);
          const endOffset = utf16Offset(slot.graphemes, local + 1);
          range.setStart(slot.node, startOffset);
          range.setEnd(slot.node, endOffset);
          step = _.sum([...range.getClientRects()].map(rect => rect.width)) ?? 0;
          break;
        }
      }
      const previous = index > 0 ? cumulative[index - 1] : undefined;
      cumulative[index] = index > 0 ? (previous ?? 0) + step : step;
    });

    return { cumulative, totalPx: cumulative[total - 1] ?? 0 };
  };

  const countAtPx = (cache: WidthCache, px: number): RevealSlice => {
    if (px <= 0 || cache.cumulative.length === 0) {
      return { full: 0, partial: 0 };
    }

    const { cumulative } = cache;
    let low = 0;
    let high = cumulative.length - 1;
    let floor = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midValue = cumulative[mid];

      if (midValue !== undefined && midValue <= px) {
        floor = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    const floorValue = floor >= 0 ? cumulative[floor] : undefined;

    return { full: floor + 1, partial: Math.max(0, px - (floorValue ?? 0)) };
  };

  const pxAt = (cache: WidthCache, graphemeCount: number) =>
    graphemeCount <= 0 ? 0 : (cache.cumulative[graphemeCount - 1] ?? cache.totalPx);

  const shellFromBody = (source: HTMLElement): BodyShell | undefined => {
    const nodes = [...source.childNodes].filter(
      node => node.nodeType !== Node.TEXT_NODE || (node.textContent ?? ``).trim() !== ``,
    );

    const [first] = nodes;

    const onlyElement =
      nodes.length === 1 && first?.nodeType === Node.ELEMENT_NODE && first instanceof Element ? first : undefined;

    if (onlyElement === undefined) {
      return undefined;
    }

    const attributes = (element: Element): HtmlAttributes => ({
      className: element.getAttribute(`class`) ?? undefined,
      style: element.getAttribute(`style`) ?? undefined,
    });

    if (onlyElement.tagName === `PRE`) {
      const code = onlyElement.querySelector(`:scope > code`);

      return code === null
        ? { inner: onlyElement.innerHTML, kind: `prePlain`, pre: attributes(onlyElement) }
        : { code: attributes(code), inner: code.innerHTML, kind: `pre`, pre: attributes(onlyElement) };
    }

    const tag = onlyElement.tagName.toLowerCase();

    return voidTags.has(tag) ? { kind: `void`, outer: attributes(onlyElement), tag } : undefined;
  };

  const shellSignature = (shell: BodyShell | undefined) =>
    shell === undefined
      ? `content`
      : shell.kind === `void`
        ? `void:${shell.tag}`
        : shell.kind === `pre`
          ? `pre:code`
          : `pre`;

  const applyAttributes = (element: HTMLElement, { className, style }: HtmlAttributes) => {
    if (className !== undefined) {
      element.className = className;
    }
    if (style !== undefined) {
      Object.assign(
        element.style,
        _.fromEntries(
          style.split(`;`).flatMap(part => {
            const colon = part.indexOf(`:`);
            if (colon === -1) {
              return [];
            }
            const key = part.slice(0, colon).trim();
            const value = part.slice(colon + 1).trim();

            return key === `` || value === `` ? [] : [[_.camelCase(key), value]];
          }),
        ),
      );
    }
  };

  const mountBody = (mountHost: HTMLElement, shell: BodyShell | undefined): HTMLElement | undefined => {
    mountHost.replaceChildren();

    if (shell === undefined) {
      const inner = document.createElement(`div`);
      mountHost.append(inner);

      return inner;
    }

    if (shell.kind === `prePlain` || shell.kind === `pre`) {
      const pre = document.createElement(`pre`);
      applyAttributes(pre, shell.pre);
      const contentParent =
        shell.kind === `pre`
          ? (() => {
              const code = document.createElement(`code`);
              applyAttributes(code, shell.code);
              pre.append(code);

              return code;
            })()
          : pre;

      const inner = document.createElement(`span`);
      contentParent.append(inner);
      mountHost.append(pre);

      return inner;
    }

    const element = document.createElement(shell.tag);
    applyAttributes(element, shell.outer);
    mountHost.append(element);

    return undefined;
  };

  const placeCaret = () => {
    if (caretElement === undefined || contentMount === undefined) {
      return;
    }

    if (partialCaretAnchor !== undefined) {
      if (caretElement.previousSibling !== partialCaretAnchor) {
        partialCaretAnchor.after(caretElement);
      }

      return;
    }

    if (textSlots !== undefined) {
      for (let index = textSlots.length - 1; index >= 0; index -= 1) {
        const slot = textSlots.at(index);
        if (slot === undefined || slot.node.data.trim().length === 0) {
          continue;
        }
        if (caretElement.previousSibling !== slot.node) {
          slot.node.after(caretElement);
        }

        return;
      }
    }

    if (caretElement.parentElement !== contentMount || caretElement !== contentMount.lastElementChild) {
      contentMount.append(caretElement);
    }
  };

  const updateCaret = () => {
    if (caretElement !== undefined) {
      caretElement.classList.toggle(styles.hidden, !(animating || waiting));
    }
  };

  const setAnimating = (next: boolean) => {
    if (animating === next) {
      return;
    }
    animating = next;
    updateCaret();
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
    mountedSignature = ``;
    textSlots = undefined;
    partialSpans.clear();
    partialCaretAnchor = undefined;
  };

  const revealSlice = (): RevealSlice =>
    widthCache === undefined ? { full: 0, partial: 0 } : countAtPx(widthCache, Math.min(revealedPx, totalPx));

  const applyReveal = (slice = revealSlice()) => {
    if (contentMount === undefined || widthCache === undefined || textSlots === undefined) {
      return;
    }

    applyRevealToSlots(textSlots, slice);
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
    partialSpans.clear();
    partialCaretAnchor = undefined;
    contentMount.style.visibility = `hidden`;
    const shell = shellFromBody(body);
    contentMount.innerHTML = shell?.kind === `pre` || shell?.kind === `prePlain` ? shell.inner : body.innerHTML;
    textSlots = collect(contentMount);
    const slotTotal = textSlots.reduce((sum, slot) => sum + slot.graphemes.length, 0);
    widthCache = widths(contentMount, textSlots, slotTotal);
    ({ totalPx } = widthCache);

    if (pendingPrefixGraphemes > 0) {
      const newAtPrefix = pxAt(widthCache, pendingPrefixGraphemes);

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

    const shell = shellFromBody(body);
    const nextSignature = shellSignature(shell);
    if (contentMount === undefined || mountedSignature !== nextSignature) {
      contentMount = mountBody(host, shell);
      mountedSignature = nextSignature;
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

  const caughtUp = () => revealedPx >= totalPx;

  const finishPush = () => {
    setAnimating(false);
    settlePending(true);
  };

  const tick = (now: number) => {
    if (host === undefined || body === undefined || widthCache === undefined) {
      stopLoop();

      return;
    }

    const elapsed = Math.max(0, now - clockLast);
    clockLast = now;
    revealedPx = Math.min(revealedPx + (elapsed / _.second) * pixelsPerSecond[speed], totalPx);

    const slice = revealSlice();
    const partialStep = (value: number) => _.round(value * 2, 0) / 2;
    if (slice.full !== lastPaintedFull || partialStep(slice.partial) !== partialStep(lastPaintedPartial)) {
      applyReveal(slice);
    }

    if (caughtUp()) {
      stopLoop();
      finishPush();

      return;
    }

    frame = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (frame !== 0 || host === undefined || caughtUp()) {
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
    if (animating) {
      startLoop();
    }
  };

  const push = async (nextHtml: string): Promise<boolean> => {
    settlePending(false);
    const id = ++pendingId;
    const { promise, resolve } = Promise.withResolvers<boolean>();
    pendingResolve = (finished: boolean) => {
      if (pendingId === id) {
        resolve(finished);
      }
    };

    const newBody = new DOMParser().parseFromString(nextHtml, `text/html`).body;
    const newSlots = collect(newBody);
    const newVisible = newSlots.map(slot => slot.text).join(``);
    const prefixGraphemes = prefix(previousVisible, newVisible);
    const cacheBeforePush = widthCache;

    if (previousVisible === `` || prefixGraphemes === 0) {
      revealedPx = 0;
      pendingPrefixGraphemes = 0;
      pendingOldAtPrefixPx = 0;
      pendingVisibleUnchanged = false;
    } else if (cacheBeforePush !== undefined) {
      pendingPrefixGraphemes = prefixGraphemes;
      pendingOldAtPrefixPx = pxAt(cacheBeforePush, prefixGraphemes);
      pendingVisibleUnchanged = previousVisible === newVisible;
    }

    body = newBody;
    previousVisible = newVisible;
    widthCache = undefined;
    totalPx = 0;
    lastPaintedFull = -1;
    lastPaintedPartial = -1;
    textSlots = undefined;

    const ready = host !== undefined && paint();
    if (host === undefined || (ready && caughtUp())) {
      finishPush();
    } else {
      setAnimating(true);
      startLoop();
    }

    return promise;
  };

  const destroy = () => {
    stopLoop();
    settlePending(false);
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
    animating = false;
    waiting = false;
  };

  const setSpeed = (value: TypeWriterSpeed) => {
    if (value === speed) {
      return;
    }
    speed = value;
    updateCaret();
    if (animating && frame === 0 && host !== undefined) {
      startLoop();
    }
  };

  const setWaiting = (value: boolean) => {
    if (waiting === value) {
      return;
    }
    waiting = value;
    if (host === undefined) {
      return;
    }
    if (body === undefined) {
      paintWaiting();
    } else {
      updateCaret();
    }
  };

  return { attach, destroy, push, setSpeed, setWaiting };
};

export type TypeWriter = ReturnType<typeof TypeWriter>;
