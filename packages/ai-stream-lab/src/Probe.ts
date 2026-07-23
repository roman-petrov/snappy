/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/prefer-dom-node-text-content */
import { TypeWriterSpeeds } from "@snappy/domain";

export type StreamLabReport = StreamLabRun | { ok: boolean; reason?: string; runs: StreamLabRun[] };

export type StreamLabRun = {
  finalText: string;
  missing?: string[];
  ok: boolean;
  rawMarkers: number;
  reason?: string;
  regressions: number;
};

export const StreamLabSpeeds = [`stream`, ...TypeWriterSpeeds] as const;

export type StreamLabSpeed = (typeof StreamLabSpeeds)[number];

const tipLength = 16;

const withoutBalancedMarks = (tip: string) =>
  tip
    .replaceAll(/\*[^\n*]+\*/gu, ` `)
    .replaceAll(/_[^\n_]+_/gu, ` `)
    .replaceAll(/`[^\n`]+`/gu, ` `);

const suspicious = (tip: string) => {
  const lastLine = tip.split(`\n`).at(-1)?.trim() ?? ``;
  const withoutFenceChars = lastLine.replaceAll(`\``, ``).replaceAll(`\u200B`, ``);

  if (lastLine.length > 0 && withoutFenceChars.length === 0) {
    return false;
  }

  const prose = withoutBalancedMarks(tip);

  return /(?:^|[\w*])\*(?!\*)|[^*]\*{2}$|(?:^|[^`])`$|(?:^|[^_])_(?!_)|~~|\|$|[[\]]$|\]\(|(?<!\\)\[[^\]]{0,32}$/u.test(
    prose,
  );
};

const lastNonEmptyText = (root: HTMLElement): Text | undefined => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let last: Text | undefined;
  let current = walker.nextNode();

  while (current !== null) {
    if (current instanceof Text && current.length > 0) {
      last = current;
    }

    current = walker.nextNode();
  }

  return last;
};

const tipInTrusted = (node: Text | undefined) => Boolean(node?.parentElement?.closest(`code, pre, td, th`));

const activeTip = (root: HTMLElement) => {
  const node = lastNonEmptyText(root);

  return { node, tip: (node?.data ?? ``).trimEnd().slice(-tipLength) };
};

const toJson = (report: StreamLabReport | undefined) =>
  report === undefined ? `` : JSON.stringify(report, undefined, 2);

type WatchConfig = { onMarkerHit: () => void; onRegression: () => void; root: HTMLElement };

const visibleLength = (root: HTMLElement) => {
  const words = (root.innerText.match(/\w+/gu) ?? []).filter(word => !/^\d+$/u.test(word));

  return words.join(` `).length;
};

const watch = ({ onMarkerHit, onRegression, root }: WatchConfig) => {
  let lastTip = ``;
  let lastLength = 0;

  const observer = new MutationObserver(() => {
    const length = visibleLength(root);

    if (length < lastLength && length > 0 && lastLength > 0) {
      onRegression();
    }

    lastLength = length;

    const { node, tip } = activeTip(root);

    if (tip === lastTip || !suspicious(tip) || tipInTrusted(node)) {
      return;
    }

    lastTip = tip;
    onMarkerHit();
  });

  observer.observe(root, { characterData: true, childList: true, subtree: true });

  const stop = () => {
    observer.disconnect();
  };

  return { stop };
};

type FinishConfig = {
  expected: string;
  finalText: string;
  rawMarkers: number;
  regressions: number;
  root: HTMLElement | undefined;
  shape: readonly string[];
};

const finish = ({ expected, finalText, rawMarkers, regressions, root, shape }: FinishConfig): StreamLabRun => {
  if (finalText !== expected) {
    return { finalText, ok: false, rawMarkers, reason: `final text mismatch`, regressions };
  }

  if (rawMarkers !== 0) {
    return { finalText, ok: false, rawMarkers, reason: `raw markers`, regressions };
  }

  if (regressions !== 0) {
    return { finalText, ok: false, rawMarkers, reason: `visible regressions`, regressions };
  }

  const missing = root === undefined ? [...shape] : shape.filter(selector => root.querySelector(selector) === null);

  if (missing.length > 0) {
    return { finalText, missing, ok: false, rawMarkers, reason: `missing shape`, regressions };
  }

  return { finalText, ok: true, rawMarkers, regressions };
};

export const Probe = { finish, toJson, watch };
