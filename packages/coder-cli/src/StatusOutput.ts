/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data, functional/no-expression-statements */
import { Console } from "@snappy/node";
import { clearLine, cursorTo } from "node:readline";

import type { TFunction } from "./locales";

import { Theme } from "./Theme";

const spinnerFrames = [`⠋`, `⠙`, `⠹`, `⠸`, `⠼`, `⠴`, `⠦`, `⠧`, `⠇`, `⠏`] as const;
const spinnerIntervalMs = 80;

export type StatusOutputConfig = { t: TFunction };

export const StatusOutput = ({ t }: StatusOutputConfig) => {
  const tools = new Map<string, string>();
  const completedToolCalls = new Set<string>();

  const state = {
    assistantStreamActive: false,
    assistantStreamText: ``,
    finalized: false,
    frame: 0,
    lastOutputWasSeparator: false,
    needsSeparatorBeforeNextMessage: false,
    processing: true,
    timer: undefined as ReturnType<typeof setInterval> | undefined,
    transientTextLength: 0,
    transientVisible: false,
    transientWrittenLabel: undefined as string | undefined,
  };

  const writeTransient = (text: string) => {
    const padding = state.transientTextLength > text.length ? ` `.repeat(state.transientTextLength - text.length) : ``;
    cursorTo(process.stdout, 0);
    process.stdout.write(`\r${text}${padding}`);
    state.transientTextLength = text.length;
    state.lastOutputWasSeparator = false;
  };

  const hardClearTransientLine = () => {
    process.stdout.write(`\r\u001B[2K`);
  };

  const clearTransient = () => {
    if (!state.transientVisible) {
      return;
    }
    hardClearTransientLine();
    cursorTo(process.stdout, 0);
    clearLine(process.stdout, 0);
    state.transientVisible = false;
    state.transientTextLength = 0;
    state.transientWrittenLabel = undefined;
  };

  const writeSeparator = () => {
    if (state.lastOutputWasSeparator) {
      return;
    }
    Console.logLine(``);
    state.lastOutputWasSeparator = true;
  };

  const consumePendingSeparator = (target: `commit` | `transient`) => {
    if (!state.needsSeparatorBeforeNextMessage) {
      return;
    }
    if (target === `commit`) {
      writeSeparator();
      state.needsSeparatorBeforeNextMessage = false;

      return;
    }
    if (state.lastOutputWasSeparator) {
      state.needsSeparatorBeforeNextMessage = false;

      return;
    }
    process.stdout.write(`\n`);
    state.lastOutputWasSeparator = true;
    state.needsSeparatorBeforeNextMessage = false;
  };

  const stopTimer = () => {
    if (state.timer === undefined) {
      return;
    }
    clearInterval(state.timer);
    state.timer = undefined;
  };

  const pickActiveToolLabel = () => {
    let lastLabel = undefined as string | undefined;
    for (const label of tools.values()) {
      lastLabel = label;
    }

    return lastLabel;
  };

  const commitBlock = (
    text: string,
    kind: `error` | `normal` = `normal`,
    options: { skipSeparator?: boolean } = {},
  ) => {
    const { skipSeparator = false } = options;
    const normalizedText = text.trimEnd();
    if (state.finalized && kind !== `error`) {
      return;
    }
    if (normalizedText.trim() === ``) {
      return;
    }
    const hadTransient = state.transientVisible;
    clearTransient();
    if (!hadTransient && !skipSeparator) {
      consumePendingSeparator(`commit`);
    }
    if (kind === `error`) {
      Console.errorLine(normalizedText);
      state.lastOutputWasSeparator = false;
      state.needsSeparatorBeforeNextMessage = true;

      return;
    }
    Console.logLine(normalizedText);
    state.lastOutputWasSeparator = false;
    state.needsSeparatorBeforeNextMessage = true;
  };

  const closeAssistantStream = (finalText?: string) => {
    if (!state.assistantStreamActive) {
      return;
    }
    if (typeof finalText === `string` && finalText.startsWith(state.assistantStreamText)) {
      const suffix = finalText.slice(state.assistantStreamText.length);
      if (suffix !== ``) {
        process.stdout.write(suffix);
      }
    }
    process.stdout.write(`\n`);
    state.assistantStreamActive = false;
    state.assistantStreamText = ``;
    state.lastOutputWasSeparator = false;
    state.needsSeparatorBeforeNextMessage = true;
  };

  const activeLabel = () => {
    if (state.finalized) {
      return undefined;
    }
    if (state.assistantStreamActive) {
      return undefined;
    }
    const toolLabel = pickActiveToolLabel();
    if (toolLabel !== undefined) {
      return toolLabel;
    }

    return state.processing ? t(`status.thinking`) : undefined;
  };

  const renderTransient = () => {
    const label = activeLabel();
    if (label === undefined) {
      clearTransient();

      return;
    }

    const previousLabel = state.transientWrittenLabel;
    const frame = spinnerFrames[state.frame % spinnerFrames.length] ?? spinnerFrames[0];
    if (
      state.transientVisible &&
      previousLabel === label &&
      frame === spinnerFrames[(state.frame - 1) % spinnerFrames.length]
    ) {
      return;
    }
    if (!state.transientVisible || previousLabel !== label) {
      consumePendingSeparator(`transient`);
      state.needsSeparatorBeforeNextMessage = true;
    }
    writeTransient(Theme.toolRunning({ frame, text: label }));
    state.transientVisible = true;
    state.transientWrittenLabel = label;
  };

  const startSpinner = () => {
    if (state.timer !== undefined) {
      return;
    }
    renderTransient();
    state.timer = setInterval(() => {
      state.frame += 1;
      renderTransient();
    }, spinnerIntervalMs);
  };

  const stopSpinner = () => {
    stopTimer();
    clearTransient();
  };

  const completeThinkingIfActive = () => {
    if (!state.processing || state.transientWrittenLabel !== t(`status.thinking`)) {
      return;
    }
    commitBlock(Theme.toolCompleted(t(`status.thought`)));
  };

  const start = () => {
    state.finalized = false;
    state.processing = true;
    state.needsSeparatorBeforeNextMessage = true;
    state.frame = 0;
    tools.clear();
    completedToolCalls.clear();
    startSpinner();
  };

  const onToolEvent = ({
    callId,
    label,
    status,
  }: {
    callId: string;
    label: string;
    status: `completed` | `running`;
  }) => {
    if (state.finalized) {
      return;
    }
    if (status === `running`) {
      if (completedToolCalls.has(callId)) {
        return;
      }
      if (tools.size === 0) {
        completeThinkingIfActive();
      }
      closeAssistantStream();
      tools.set(callId, label);
      renderTransient();
      startSpinner();

      return;
    }
    closeAssistantStream();
    if (completedToolCalls.has(callId)) {
      return;
    }
    completedToolCalls.add(callId);
    tools.delete(callId);
    commitBlock(Theme.toolCompleted(label));
    renderTransient();
  };

  const assistantMessage = (text: string) => {
    if (state.finalized || text.trim() === ``) {
      return;
    }
    if (state.assistantStreamActive) {
      closeAssistantStream(text);

      return;
    }
    closeAssistantStream(text);
    completeThinkingIfActive();
    commitBlock(text);
  };

  const assistantDelta = (chunk: string) => {
    if (state.finalized || chunk === ``) {
      return;
    }
    completeThinkingIfActive();
    if (!state.assistantStreamActive) {
      const hadTransient = state.transientVisible;
      clearTransient();
      if (!hadTransient) {
        consumePendingSeparator(`commit`);
      }
      state.assistantStreamActive = true;
      state.assistantStreamText = ``;
    }
    process.stdout.write(chunk);
    state.assistantStreamText += chunk;
    state.lastOutputWasSeparator = false;
    state.needsSeparatorBeforeNextMessage = true;
  };

  const succeed = () => {
    if (state.finalized) {
      return;
    }
    completeThinkingIfActive();
    state.processing = false;
    state.finalized = true;
    stopSpinner();
  };

  const fail = (message: string) => {
    if (state.finalized) {
      return;
    }
    const hadTransient = state.transientVisible;
    state.processing = false;
    state.finalized = true;
    closeAssistantStream();
    stopTimer();
    commitBlock(message, `error`, { skipSeparator: hadTransient });
    clearTransient();
  };

  return { assistantDelta, assistantMessage, fail, onToolEvent, start, succeed };
};

export type StatusOutput = ReturnType<typeof StatusOutput>;
