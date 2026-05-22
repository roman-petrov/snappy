/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { _ } from "@snappy/core";

type BodyShell =
  | { code: HtmlAttributes; inner: string; kind: `pre`; pre: HtmlAttributes }
  | { inner: string; kind: `prePlain`; pre: HtmlAttributes }
  | { kind: `void`; outer: HtmlAttributes; tag: string };

type HtmlAttributes = { className?: string; style?: string };

const voidTags = new Set([
  `area`,
  `base`,
  `br`,
  `col`,
  `embed`,
  `hr`,
  `img`,
  `input`,
  `link`,
  `meta`,
  `param`,
  `source`,
  `track`,
  `wbr`,
]);

const shellAttributes = (element: Element): HtmlAttributes => ({
  className: element.getAttribute(`class`) ?? undefined,
  style: element.getAttribute(`style`) ?? undefined,
});

const significantNodes = (parent: ParentNode) =>
  [...parent.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE || (node.textContent ?? ``).trim() !== ``);

const shellFromBody = (body: HTMLElement): BodyShell | undefined => {
  const nodes = significantNodes(body);
  const [first] = nodes;

  const onlyElement =
    nodes.length === 1 && first?.nodeType === Node.ELEMENT_NODE && first instanceof Element ? first : undefined;

  if (onlyElement === undefined) {
    return undefined;
  }

  if (onlyElement.tagName === `PRE`) {
    const code = onlyElement.querySelector(`:scope > code`);

    return code === null
      ? { inner: onlyElement.innerHTML, kind: `prePlain`, pre: shellAttributes(onlyElement) }
      : { code: shellAttributes(code), inner: code.innerHTML, kind: `pre`, pre: shellAttributes(onlyElement) };
  }

  const tag = onlyElement.tagName.toLowerCase();

  return voidTags.has(tag) ? { kind: `void`, outer: shellAttributes(onlyElement), tag } : undefined;
};

const inlineStyle = (css: string) =>
  _.fromEntries(
    css.split(`;`).flatMap(part => {
      const colon = part.indexOf(`:`);
      if (colon === -1) {
        return [];
      }

      const key = part.slice(0, colon).trim();
      const value = part.slice(colon + 1).trim();

      return key === `` || value === `` ? [] : [[_.camelCase(key), value]];
    }),
  );

const applyAttributes = (element: HTMLElement, { className, style }: HtmlAttributes) => {
  if (className !== undefined) {
    element.className = className;
  }
  if (style !== undefined) {
    Object.assign(element.style, inlineStyle(style));
  }
};

const appendContentRoot = (host: HTMLElement) => {
  const inner = document.createElement(`div`);
  inner.setAttribute(`data-tw-content`, ``);
  host.append(inner);
};

const mountBody = (host: HTMLElement, body: HTMLElement) => {
  const shell = shellFromBody(body);
  host.replaceChildren();

  if (shell === undefined) {
    appendContentRoot(host);

    return;
  }

  if (shell.kind === `prePlain`) {
    const pre = document.createElement(`pre`);
    applyAttributes(pre, shell.pre);
    const inner = document.createElement(`span`);
    inner.setAttribute(`data-tw-content`, ``);
    pre.append(inner);
    host.append(pre);

    return;
  }

  if (shell.kind === `pre`) {
    const pre = document.createElement(`pre`);
    const code = document.createElement(`code`);
    applyAttributes(pre, shell.pre);
    applyAttributes(code, shell.code);
    const inner = document.createElement(`span`);
    inner.setAttribute(`data-tw-content`, ``);
    code.append(inner);
    pre.append(code);
    host.append(pre);

    return;
  }

  const element = document.createElement(shell.tag);
  applyAttributes(element, shell.outer);
  host.append(element);
};

const signature = (body: HTMLElement): string => {
  const shell = shellFromBody(body);

  return shell === undefined
    ? `content`
    : shell.kind === `void`
      ? `void:${shell.tag}`
      : shell.kind === `pre`
        ? `pre:code`
        : `pre`;
};

const html = (body: HTMLElement): string => {
  const shell = shellFromBody(body);

  return shell?.kind === `pre` || shell?.kind === `prePlain` ? shell.inner : body.innerHTML;
};

export const Shell = { html, mount: mountBody, signature };
