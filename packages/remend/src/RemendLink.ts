/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-continue */
import { Unicode } from "@snappy/core";

const fence = `\`\`\``;
const ph = `#`;
const taskPad = ` ${Unicode.zeroWidthSpace}`;

const escaped = (text: string, index: number) => {
  let slashes = 0;

  for (let at = index - 1; at >= 0 && text[at] === `\\`; at -= 1) {
    slashes += 1;
  }

  return slashes % 2 === 1;
};

const inCode = (text: string, index: number) => {
  let open = false;

  for (let at = 0; at < index;) {
    if (text.startsWith(fence, at)) {
      open = !open;
      at += fence.length;
      continue;
    }

    if (open) {
      at += 1;
      continue;
    }

    if (text[at] === `\`` && !escaped(text, at)) {
      const close = text.indexOf(`\``, at + 1);

      if (close === -1 || close >= index) {
        return true;
      }

      at = close + 1;
      continue;
    }

    at += 1;
  }

  return open;
};

const matchBracket = (text: string, from: number, dir: -1 | 1) => {
  const open = dir === 1 ? `[` : `]`;
  let depth = 0;

  for (let at = from; at >= 0 && at < text.length; at += dir) {
    const char = text[at];

    if ((char !== `[` && char !== `]`) || escaped(text, at)) {
      continue;
    }

    depth += char === open ? 1 : -1;

    if (depth === 0) {
      return at;
    }
  }

  return -1;
};

const isImage = (text: string, open: number) => open > 0 && text[open - 1] === `!`;

const closeUrl = (after: string) => {
  const quote = after.indexOf(`"`);

  return quote !== -1 && !after.slice(quote + 1).includes(`"`) ? `")` : after === `` ? `${ph})` : `)`;
};

const tipUrl = (text: string) => {
  const paren = text.lastIndexOf(`](`);

  if (paren === -1 || inCode(text, paren) || text.slice(paren + 2).includes(`)`)) {
    return undefined;
  }

  const open = matchBracket(text, paren, -1);

  return open === -1
    ? undefined
    : isImage(text, open)
      ? text.slice(0, open - 1)
      : `${text}${closeUrl(text.slice(paren + 2))}`;
};

const tipReference = (text: string) => {
  const ref = text.lastIndexOf(`][`);

  if (ref === -1 || inCode(text, ref) || text.slice(ref + 2).includes(`]`)) {
    return undefined;
  }

  const open = matchBracket(text, ref, -1);

  return open === -1
    ? undefined
    : isImage(text, open)
      ? text.slice(0, open - 1)
      : `${text.slice(0, open)}[${text.slice(open + 1, ref)}](${ph})`;
};

const tipAutolink = (text: string) => {
  const closable = /<https?:\/\/[^\s>]*$/u.exec(text);

  if (closable !== null && !inCode(text, closable.index)) {
    return `${text}>`;
  }

  const early = /<https?(?::\/{0,2})?$/u.exec(text);

  return early === null || inCode(text, early.index) ? undefined : text.slice(0, early.index);
};

const tipTask = (text: string, open: number) => {
  const lineEnd = text.indexOf(`\n`, open);
  const line = text.slice(open, lineEnd === -1 ? text.length : lineEnd);
  const after = lineEnd === -1 ? `` : text.slice(lineEnd);
  const before = text.slice(text.lastIndexOf(`\n`, open - 1) + 1, open);

  if (!/^\s*(?:[*+-]|\d+\.)\s+$/u.test(before)) {
    return undefined;
  }

  if (/^\[[ x]?$/iu.test(line)) {
    const mark = line.length > 1 && /x/iu.test(line[1] ?? ``) ? `x` : ` `;

    return `${text.slice(0, open)}[${mark}]${taskPad}${after}`;
  }

  const bare = /^\[(?<mark>[ x])\]\s*$/iu.exec(line);

  return bare === null ? undefined : `${text.slice(0, open)}[${bare.groups?.[`mark`] ?? ` `}]${taskPad}${after}`;
};

const tipLabel = (text: string) => {
  for (let at = text.length - 1; at >= 0; at -= 1) {
    if (text[at] !== `[` || escaped(text, at) || inCode(text, at)) {
      continue;
    }

    const task = tipTask(text, at);

    if (task !== undefined) {
      return task === text ? undefined : task;
    }

    const close = matchBracket(text, at, 1);

    if (close === -1) {
      return isImage(text, at) ? text.slice(0, at - 1) : `${text}](${ph})`;
    }

    if (text.slice(close + 1) !== `` || (at > 0 && text[at - 1] === `]`)) {
      continue;
    }

    return isImage(text, at) ? text.slice(0, at - 1) : `${text}(${ph})`;
  }

  return undefined;
};

const tip = (text: string) => tipUrl(text) ?? tipReference(text) ?? tipAutolink(text) ?? tipLabel(text);

const hasDefinition = (text: string, ref: string) => {
  const at = text.indexOf(`[${ref}]:`);

  if (at === -1) {
    return false;
  }

  const after = text.slice(at + `[${ref}]:`.length).trimStart();

  return after.length > 0 && !after.startsWith(`\n`) && !after.startsWith(`\r`);
};

const repairReferences = (text: string) => {
  let output = ``;
  let cursor = 0;
  let changed = false;

  for (let open = text.indexOf(`[`); open !== -1; open = text.indexOf(`[`, open + 1)) {
    if (escaped(text, open) || inCode(text, open)) {
      continue;
    }

    const labelClose = matchBracket(text, open, 1);

    if (labelClose === -1 || text[labelClose + 1] !== `[`) {
      continue;
    }

    const refClose = matchBracket(text, labelClose + 1, 1);

    if (refClose === -1) {
      continue;
    }

    output += text.slice(cursor, open);
    const label = text.slice(open + 1, labelClose);
    const ref = text.slice(labelClose + 2, refClose);

    if (hasDefinition(text, ref)) {
      output += text.slice(open, refClose + 1);
    } else {
      changed = true;
      output += `[${label}](${ph})`;
    }

    cursor = refClose + 1;
    open = refClose;
  }

  return changed ? `${output}${text.slice(cursor)}` : undefined;
};

const repairDefinition = (text: string) => {
  const start = text.lastIndexOf(`\n`) + 1;
  const line = text.slice(start);
  const match = /^\[(?<ref>[^\]]+)\]:(?<rest>.*)$/u.exec(line);

  if (match === null || inCode(text, start)) {
    return undefined;
  }

  const ref = match.groups?.[`ref`] ?? ``;
  const rest = (match.groups?.[`rest`] ?? ``).trim();

  if (rest === ``) {
    return text.slice(0, start);
  }

  const quote = rest.indexOf(`"`);

  if (quote === -1 || rest.slice(quote + 1).includes(`"`)) {
    return undefined;
  }

  const url = rest.slice(0, quote).trim();

  return url === `` ? text.slice(0, start) : `${text.slice(0, start)}[${ref}]: ${url}`;
};

const repair = (text: string) => {
  if (!text.includes(`[`) && !/<https?/u.test(text)) {
    return text;
  }

  const next = tip(text) ?? text;
  const defined = repairDefinition(next) ?? next;

  return repairReferences(defined) ?? defined;
};

export const RemendLink = { repair };
