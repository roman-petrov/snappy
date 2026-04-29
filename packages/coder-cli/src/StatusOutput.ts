/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data, functional/no-expression-statements */
import { _ } from "@snappy/core";
import { Console } from "@snappy/node";
import { clearLine, cursorTo } from "node:readline";

import { Theme } from "./Theme";

const spinnerFrames = [`⠋`, `⠙`, `⠹`, `⠸`, `⠼`, `⠴`, `⠦`, `⠧`, `⠇`, `⠏`] as const;
const spinnerIntervalMs = 80;

export const StatusOutput = () => {
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
    thinkingLabel: undefined as string | undefined,
    timer: undefined as ReturnType<typeof setInterval> | undefined,
    transient: { label: undefined as string | undefined, lineCount: 1, plainText: ``, visible: false },
  };

  const transientLineCount = (textLength: number) => {
    const { columns } = process.stdout;
    if (!_.isNumber(columns) || columns <= 0) {
      return 1;
    }

    return Math.max(Math.ceil(textLength / columns), 1);
  };

  const moveToTransientStart = () => {
    if (state.transient.lineCount <= 1) {
      cursorTo(process.stdout, 0);

      return;
    }
    process.stdout.write(`\u001B[${String(state.transient.lineCount - 1)}A`);
    cursorTo(process.stdout, 0);
  };

  const clearTransientLines = () => {
    moveToTransientStart();
    for (let index = 0; index < state.transient.lineCount; index += 1) {
      clearLine(process.stdout, 0);
      if (index < state.transient.lineCount - 1) {
        process.stdout.write(`\u001B[1B`);
      }
    }
    if (state.transient.lineCount > 1) {
      process.stdout.write(`\u001B[${String(state.transient.lineCount - 1)}A`);
      cursorTo(process.stdout, 0);
    }
  };

  const writeTransient = ({ plain, text }: { plain: string; text: string }) => {
    const previousLength = state.transient.plainText.length;
    const padding = previousLength > plain.length ? ` `.repeat(previousLength - plain.length) : ``;
    moveToTransientStart();
    process.stdout.write(`\r${text}${padding}`);
    state.transient.plainText = plain;
    state.transient.lineCount = transientLineCount(plain.length);
    state.lastOutputWasSeparator = false;
  };

  const clearTransient = () => {
    if (!state.transient.visible) {
      return;
    }
    clearTransientLines();
    state.transient.visible = false;
    state.transient.label = undefined;
    state.transient.lineCount = 1;
    state.transient.plainText = ``;
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
    const hadTransient = state.transient.visible;
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

    return state.thinkingLabel;
  };

  const renderTransient = () => {
    const label = activeLabel();
    if (label === undefined) {
      clearTransient();

      return;
    }

    const previousLabel = state.transient.label;
    const frame = spinnerFrames[state.frame % spinnerFrames.length] ?? spinnerFrames[0];
    if (!state.transient.visible || previousLabel !== label) {
      consumePendingSeparator(`transient`);
      state.needsSeparatorBeforeNextMessage = true;
    }
    writeTransient({ plain: `${frame} ${label}`, text: Theme.toolRunning({ frame, text: label }) });
    state.transient.visible = true;
    state.transient.label = label;
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

  const completeThinkingIfActive = (label: string) => {
    if (!state.processing || state.thinkingLabel === undefined) {
      return;
    }
    state.thinkingLabel = undefined;
    commitBlock(Theme.toolCompleted(label));
    renderTransient();
  };

  const start = () => {
    state.finalized = false;
    state.processing = true;
    state.thinkingLabel = undefined;
    state.needsSeparatorBeforeNextMessage = true;
    state.frame = 0;
    tools.clear();
    completedToolCalls.clear();
    startSpinner();
  };

  const onThinkingEvent = ({ label, status }: { label: string; status: `completed` | `running` }) => {
    if (state.finalized) {
      return;
    }
    closeAssistantStream();
    if (status === `running`) {
      state.thinkingLabel = label;
      renderTransient();
      startSpinner();

      return;
    }
    completeThinkingIfActive(label);
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
    commitBlock(text);
  };

  const assistantDelta = (chunk: string) => {
    if (state.finalized || chunk === ``) {
      return;
    }
    if (!state.assistantStreamActive) {
      const hadTransient = state.transient.visible;
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
    state.processing = false;
    state.finalized = true;
    stopSpinner();
  };

  const fail = (message: string) => {
    if (state.finalized) {
      return;
    }
    const hadTransient = state.transient.visible;
    state.processing = false;
    state.finalized = true;
    closeAssistantStream();
    stopTimer();
    commitBlock(message, `error`, { skipSeparator: hadTransient });
    clearTransient();
  };

  return { assistantDelta, assistantMessage, fail, onThinkingEvent, onToolEvent, start, succeed };
};

export type StatusOutput = ReturnType<typeof StatusOutput>;
