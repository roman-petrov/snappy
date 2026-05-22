/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
import { _ } from "@snappy/core";

const segmenter = new Intl.Segmenter();
const partialAttribute = `data-tw-partial`;
const partialStyle = `display:inline-block;overflow:hidden;vertical-align:bottom;`;

export type Slot = { end: number; node: Text; start: number; text: string };

export type Slots = { slots: readonly Slot[]; total: number };

const graphemes = (source: string) => [...segmenter.segment(source)].map(part => part.segment);

const removePartialAfter = (node: Text) => {
  const next = node.nextSibling;

  if (next instanceof HTMLElement && next.hasAttribute(partialAttribute)) {
    next.remove();
  }
};

const applyPartialAfter = (node: Text, grapheme: string, widthPx: number) => {
  const next = node.nextSibling;
  let span = next instanceof HTMLElement && next.hasAttribute(partialAttribute) ? next : undefined;

  if (span === undefined) {
    removePartialAfter(node);
    span = document.createElement(`span`);
    span.setAttribute(partialAttribute, ``);
    span.style.cssText = partialStyle;
    node.after(span);
  }

  span.style.width = `${widthPx}px`;
  span.textContent = grapheme;
};

const parse = (html: string) => new DOMParser().parseFromString(html, `text/html`).body;

const collect = (root: ParentNode): Slots => {
  const slots: Slot[] = [];
  let total = 0;

  const visit = (node: Node) => {
    if (node instanceof Text) {
      const text = node.textContent;
      const { length } = graphemes(text);
      slots.push({ end: total + length, node, start: total, text });
      total += length;

      return;
    }
    for (const child of node.childNodes) {
      visit(child);
    }
  };

  visit(root);

  return { slots, total };
};

const plain = (slots: readonly Slot[]) => slots.map(slot => slot.text).join(``);

const prefix = (left: string, right: string) => {
  if (left === right) {
    return graphemes(left).length;
  }

  const a = graphemes(left);
  const b = graphemes(right);
  const max = Math.min(a.length, b.length);

  return _.gen(max, index => index).find(index => a[index] !== b[index]) ?? max;
};

export type RevealSlice = { full: number; partial: number };

const apply = (slots: readonly Slot[], { full, partial }: RevealSlice) => {
  for (const slot of slots) {
    const parts = graphemes(slot.text);
    const { length } = parts;
    const localFull = Math.max(0, Math.min(length, full - slot.start));
    const showPartial = partial > 0 && full >= slot.start && full < slot.end;
    const partialIndex = full - slot.start;

    if (showPartial) {
      const visible = parts.slice(0, localFull).join(``);
      slot.node.textContent = visible;
      applyPartialAfter(slot.node, parts[partialIndex] ?? ``, partial);
    } else {
      removePartialAfter(slot.node);

      if (localFull === length) {
        slot.node.textContent = slot.text;
      } else if (localFull === 0) {
        slot.node.textContent = ``;
      } else {
        slot.node.textContent = parts.slice(0, localFull).join(``);
      }
    }
  }
};

export const HtmlReveal = { apply, collect, graphemes, parse, plain, prefix };
