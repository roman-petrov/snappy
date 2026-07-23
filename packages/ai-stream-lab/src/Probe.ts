/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
export type StreamLabReport = StreamLabRun | { ok: boolean; reason?: string; runs: StreamLabRun[] };

export type StreamLabRun = { finalText: string; missing?: string[]; ok: boolean; rawMarkers: number; reason?: string };

export type StreamLabSpeed = `fast` | `medium` | `slow` | `stream`;

const tipLength = 16;

const suspicious = (tip: string) => {
  const lastLine = tip.split(`\n`).at(-1)?.trim() ?? ``;
  const withoutFenceChars = lastLine.replaceAll(`\``, ``).replaceAll(`\u200B`, ``);

  if (lastLine.length > 0 && withoutFenceChars.length === 0) {
    return false;
  }

  return /(?:^|[\w*])\*(?!\*)|[^*]\*{2}$|(?:^|[^`])`$|(?:^|[^_])_(?!_)|~~|\|$/u.test(tip);
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

type WatchConfig = { onMarkerHit: () => void; root: HTMLElement };

const watch = ({ onMarkerHit, root }: WatchConfig) => {
  let lastTip = ``;

  const observer = new MutationObserver(() => {
    const { node, tip } = activeTip(root);

    if (tip === lastTip || !suspicious(tip) || tipInTrusted(node)) {
      return;
    }

    lastTip = tip;
    onMarkerHit();
  });

  observer.observe(root, { characterData: true, childList: true, subtree: true });

  return {
    stop: () => {
      observer.disconnect();
    },
  };
};

type FinishConfig = {
  expected: string;
  finalText: string;
  rawMarkers: number;
  root: HTMLElement | undefined;
  shape: readonly string[];
};

const finish = ({ expected, finalText, rawMarkers, root, shape }: FinishConfig): StreamLabRun => {
  if (finalText !== expected) {
    return { finalText, ok: false, rawMarkers, reason: `final text mismatch` };
  }

  if (rawMarkers !== 0) {
    return { finalText, ok: false, rawMarkers, reason: `raw markers` };
  }

  const missing = root === undefined ? [...shape] : shape.filter(selector => root.querySelector(selector) === null);

  if (missing.length > 0) {
    return { finalText, missing, ok: false, rawMarkers, reason: `missing shape` };
  }

  return { finalText, ok: true, rawMarkers };
};

export const Probe = { activeTip, finish, suspicious, toJson, watch };
