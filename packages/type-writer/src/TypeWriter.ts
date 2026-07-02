/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/prefer-includes-over-repeated-comparisons */
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

export const TypeWriter = () => {
  const segmenter = new Intl.Segmenter();
  const partialSpans = new Map<Text, HTMLSpanElement>();
  const voidTags = new Set([`br`, `hr`, `img`]);
  const pixelsPerSecond = { fast: 0x4_00, medium: 0x2_00, slow: 0x1_00 } as const;
  const caretPeriodMs = 750;
  const maxTickMs = 50;
  let host: HTMLElement | undefined;
  let caretElement: HTMLSpanElement | undefined;
  let body: HTMLElement | undefined;
  let previousVisible = ``;
  let lastHtml = ``;
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
  let textSlots: readonly Slot[] | undefined;
  let cumulative: Float32Array | undefined;
  let totalGraphemes = 0;
  let carry = 0;
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

  const applyRevealToSlots = (slots: readonly Slot[], { full, partial }: RevealSlice, fromFull: number) => {
    const incremental = fromFull >= 0 && fromFull <= full;
    partialCaretAnchor = undefined;
    for (const slot of slots) {
      if (incremental && (slot.end < fromFull || slot.start > full)) {
        continue;
      }
      const parts = slot.graphemes;
      const { length } = parts;
      const localFull = _.clamp(full - slot.start, 0, length);
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

  const measureFrom = (from: number) => {
    if (textSlots === undefined || cumulative === undefined || from >= totalGraphemes) {
      return;
    }

    const range = document.createRange();
    let index = from;

    for (const slot of textSlots) {
      if (index >= totalGraphemes) {
        break;
      }
      if (slot.end <= index) {
        continue;
      }

      while (index < slot.end) {
        const local = index - slot.start;
        range.setStart(slot.node, utf16Offset(slot.graphemes, local));
        range.setEnd(slot.node, utf16Offset(slot.graphemes, local + 1));
        const step = _.sum([...range.getClientRects()].map(rect => rect.width)) ?? 0;
        cumulative[index] = (index > 0 ? (cumulative[index - 1] ?? 0) : 0) + step;
        index += 1;
      }
    }
  };

  const pxAt = (graphemeCount: number) =>
    graphemeCount <= 0 ? 0 : (cumulative?.[Math.min(graphemeCount, cumulative.length) - 1] ?? 0);

  const countAtPx = (px: number): RevealSlice => {
    if (px <= 0 || cumulative === undefined || cumulative.length === 0) {
      return { full: 0, partial: 0 };
    }

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

  const syncCaretPhase = () => {
    if (caretElement !== undefined) {
      caretElement.style.animationDelay = `-${performance.now() % caretPeriodMs}ms`;
    }
  };

  const placeCaret = () => {
    if (caretElement === undefined || contentMount === undefined) {
      return;
    }

    if (partialCaretAnchor !== undefined) {
      if (caretElement.previousSibling !== partialCaretAnchor) {
        partialCaretAnchor.after(caretElement);
        syncCaretPhase();
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
          syncCaretPhase();
        }

        return;
      }
    }

    if (caretElement.parentElement !== contentMount || caretElement !== contentMount.lastElementChild) {
      contentMount.append(caretElement);
      syncCaretPhase();
    }
  };

  const hideUnrevealed = () => {
    if (contentMount === undefined || caretElement === undefined || !contentMount.contains(caretElement)) {
      return;
    }

    const write = (element: HTMLElement, property: `display` | `marginBlockEnd`, value: string) => {
      if (element.style[property] !== value) {
        element.style[property] = value;
      }
    };

    let passedCaret = false;
    let lastVisible: HTMLElement | undefined;
    let hiddenAfter = false;

    for (const child of contentMount.children) {
      if (child === caretElement) {
        passedCaret = true;
        continue;
      }
      if (!(child instanceof HTMLElement)) {
        continue;
      }
      write(child, `display`, passedCaret ? `none` : ``);
      write(child, `marginBlockEnd`, ``);
      if (passedCaret) {
        hiddenAfter = true;
      } else {
        lastVisible = child;
        passedCaret = child.contains(caretElement);
      }
    }

    if (hiddenAfter && lastVisible !== undefined) {
      write(lastVisible, `marginBlockEnd`, _.px(0));
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
    cumulative = undefined;
    totalGraphemes = 0;
    totalPx = 0;
    carry = 0;
    partialSpans.clear();
    partialCaretAnchor = undefined;
  };

  const revealSlice = () =>
    revealedPx >= totalPx ? { full: totalGraphemes, partial: 0 } : countAtPx(Math.min(revealedPx, totalPx));

  const applyReveal = (slice = revealSlice()) => {
    if (contentMount === undefined || cumulative === undefined || textSlots === undefined) {
      return;
    }

    applyRevealToSlots(textSlots, slice, lastPaintedFull);
    lastPaintedFull = slice.full;
    lastPaintedPartial = slice.partial;
    placeCaret();
    updateCaret();
    hideUnrevealed();
  };

  const rebuild = (shell: BodyShell | undefined) => {
    if (contentMount === undefined || body === undefined) {
      return;
    }

    partialSpans.clear();
    partialCaretAnchor = undefined;
    lastPaintedFull = -1;
    lastPaintedPartial = -1;
    contentMount.innerHTML = shell?.kind === `pre` || shell?.kind === `prePlain` ? shell.inner : body.innerHTML;
    textSlots = collect(contentMount);
    totalGraphemes = textSlots.reduce((sum, slot) => sum + slot.graphemes.length, 0);

    const keep = Math.min(carry, totalGraphemes);
    carry = 0;
    const previous = cumulative;
    cumulative = new Float32Array(totalGraphemes);
    if (previous !== undefined && keep > 0) {
      cumulative.set(previous.subarray(0, keep));
    }
    measureFrom(keep);
    totalPx = cumulative[totalGraphemes - 1] ?? 0;
    revealedPx = Math.min(revealedPx, totalPx);
    applyReveal();
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
      textSlots = undefined;
      placeCaret();
    }

    if (contentMount === undefined) {
      return false;
    }

    if (textSlots === undefined) {
      rebuild(shell);
    }

    return textSlots !== undefined;
  };

  const paintWaiting = () => {
    if (host === undefined) {
      return;
    }
    ensureCaret();
    resetMount();
    if (caretElement !== undefined) {
      host.replaceChildren(caretElement);
      syncCaretPhase();
    }
    updateCaret();
  };

  const caughtUp = () => revealedPx >= totalPx;

  const finishPush = () => {
    setAnimating(false);
    settlePending(true);
  };

  const tick = (now: number) => {
    if (host === undefined || body === undefined || cumulative === undefined) {
      stopLoop();

      return;
    }

    const elapsed = _.clamp(now - clockLast, 0, maxTickMs);
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
    if (host === undefined || frame !== 0 || caughtUp()) {
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

    if (pendingResolve === undefined) {
      body = undefined;
      previousVisible = ``;
      lastHtml = ``;
      revealedPx = 0;
    }

    if (body === undefined) {
      paintWaiting();
    } else {
      paint();
      if (caughtUp()) {
        finishPush();
      } else {
        setAnimating(true);
        startLoop();
      }
    }
    updateCaret();
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

    if (nextHtml === lastHtml && contentMount !== undefined && textSlots !== undefined) {
      if (caughtUp()) {
        finishPush();
      } else {
        setAnimating(true);
        startLoop();
      }

      return promise;
    }

    lastHtml = nextHtml;
    const newBody = new DOMParser().parseFromString(nextHtml, `text/html`).body;
    const newVisible = newBody.textContent;
    carry = Math.min(prefix(previousVisible, newVisible), cumulative?.length ?? 0);
    revealedPx = Math.min(revealedPx, pxAt(carry));

    body = newBody;
    previousVisible = newVisible;
    textSlots = undefined;
    lastPaintedFull = -1;
    lastPaintedPartial = -1;

    if (host === undefined) {
      if (newVisible === ``) {
        finishPush();
      } else {
        setAnimating(true);
      }
    } else {
      const ready = paint();
      if (!ready || caughtUp()) {
        finishPush();
      } else {
        setAnimating(true);
        startLoop();
      }
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
    lastHtml = ``;
    revealedPx = 0;
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
    if (animating && host !== undefined) {
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
