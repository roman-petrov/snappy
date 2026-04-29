import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  events: [] as string[],
  push: (entry: string) => {
    mocks.events.push(entry);
  },
}));

const escape = (value: string) =>
  value
    .replaceAll(`\r`, String.raw`\r`)
    .replaceAll(`\n`, String.raw`\n`)
    .split(``)
    .map(char => {
      const code = char.codePointAt(0) ?? 0;

      return code === 0x1b || code >= 0x20 ? char : `?`;
    })
    .join(``);

vi.mock(`@snappy/node`, () => ({
  Console: {
    errorLine: (text: string) => {
      mocks.push(`ERR ${escape(text)}`);
    },
    logLine: (text: string) => {
      mocks.push(`LOG ${escape(text)}`);
    },
  },
  Terminal: {
    bold: Object.assign((text: string) => text, { cyan: (text: string) => text }),
    cyan: Object.assign((text: string) => text, { bold: (text: string) => text }),
    dim: (text: string) => text,
    green: Object.assign((text: string) => text, { bold: (text: string) => text }),
    red: Object.assign((text: string) => text, { bold: (text: string) => text }),
    yellow: (text: string) => text,
  },
}));

vi.mock(`node:readline`, () => ({
  clearLine: (_stream: WritableStream, dir: number) => {
    mocks.push(`CLEAR ${String(dir)}`);
  },
  cursorTo: (_stream: WritableStream, col: number) => {
    mocks.push(`CURSOR ${String(col)}`);
  },
  default: {
    clearLine: (_stream: WritableStream, dir: number) => {
      mocks.push(`CLEAR ${String(dir)}`);
    },
    cursorTo: (_stream: WritableStream, col: number) => {
      mocks.push(`CURSOR ${String(col)}`);
    },
  },
}));

import { StatusOutput } from "./StatusOutput";

const snapshotLog = () => mocks.events.join(`\n`);

const committedMessages = () =>
  mocks.events
    .filter(entry => entry.startsWith(`LOG `) || entry.startsWith(`ERR `))
    .map(entry => entry.slice(4))
    .filter(text => text !== ``);

const committedMessagesWithoutIcon = () => committedMessages().map(text => text.replace(/^[^0-9A-Za-z]+\s/u, ``));
const isSeparatorEvent = (entry: string) => entry === `LOG ` || entry === String.raw`WRITE \n`;

const assertSingleEmptyLineBetweenCommitted = () => {
  const isCommittedEvent = (entry: string) =>
    entry.startsWith(`ERR `) || (entry.startsWith(`LOG `) && entry.slice(4) !== ``);

  const committedIndexes = mocks.events
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => isCommittedEvent(entry))
    .map(({ index }) => index);

  for (let index = 1; index < committedIndexes.length; index += 1) {
    const previous = committedIndexes[index - 1];
    const current = committedIndexes[index];
    if (previous === undefined || current === undefined) {
      throw new Error(`terminal_status_output_committed_index_missing`);
    }
    const between = mocks.events.slice(previous + 1, current);
    const separatorCount = between.filter(isSeparatorEvent).length;

    expect(separatorCount).toBe(1);
  }
};

const assertNoAdjacentSeparators = () => {
  for (let index = 1; index < mocks.events.length; index += 1) {
    const previous = mocks.events[index - 1];
    const current = mocks.events[index];
    if (previous === undefined || current === undefined) {
      throw new Error(`terminal_status_output_separator_index_missing`);
    }
    if (isSeparatorEvent(previous) && isSeparatorEvent(current)) {
      throw new Error(`terminal_status_output_double_separator`);
    }
  }
};

const startThinking = (output: ReturnType<typeof StatusOutput>) =>
  output.onThinkingEvent({ label: `Thinking...`, status: `running` });

const finishThinking = (output: ReturnType<typeof StatusOutput>) =>
  output.onThinkingEvent({ label: `Thought`, status: `completed` });

const setupStatusOutput = () => {
  vi.useFakeTimers();
  mocks.events.length = 0;
  vi.spyOn(process.stdout, `write`).mockImplementation(chunk => {
    mocks.push(`WRITE ${escape(String(chunk))}`);

    return true;
  });
};

const cleanupStatusOutput = () => {
  vi.restoreAllMocks();
  vi.useRealTimers();
};

describe(`terminalStatusOutput`, () => {
  it(`keeps spinner spinning for wrapped long status text`, () => {
    setupStatusOutput();
    const columnsDescriptor = Object.getOwnPropertyDescriptor(process.stdout, `columns`);
    Object.defineProperty(process.stdout, `columns`, { configurable: true, value: 12 });
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.onToolEvent({ callId: `1`, label: `Very long tool label`, status: `running` });
      vi.advanceTimersByTime(240);
      output.onToolEvent({ callId: `1`, label: `Very long tool label`, status: `completed` });
      output.succeed();

      const transientWrites = mocks.events
        .filter(entry => entry.startsWith(String.raw`WRITE \r`) && !entry.includes(String.raw`\u001B[2K`))
        .map(entry => entry.slice(String.raw`WRITE \r`.length));

      expect(transientWrites.length).toBeGreaterThan(0);
      expect(transientWrites.some(text => text.length > 12)).toBe(true);
      expect(transientWrites.filter(text => text.includes(`Very long tool label`)).length).toBeGreaterThan(1);
      expect(committedMessages().some(text => text.includes(`Very long tool label`))).toBe(true);
    } finally {
      if (columnsDescriptor === undefined) {
        Object.defineProperty(process.stdout, `columns`, { configurable: true, value: undefined });
      } else {
        Object.defineProperty(process.stdout, `columns`, columnsDescriptor);
      }
      cleanupStatusOutput();
    }
  });

  it(`renders assistant flow snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.assistantMessage(`assistant text`);
      output.succeed();

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`, `assistant text`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        LOG 
        LOG assistant text"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`renders mixed tool and assistant flow snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);

      output.onToolEvent({ callId: `1`, label: `Search project`, status: `running` });
      vi.advanceTimersByTime(120);
      output.onToolEvent({ callId: `1`, label: `Search project`, status: `completed` });
      startThinking(output);
      finishThinking(output);
      output.assistantMessage(`First answer block`);
      startThinking(output);
      finishThinking(output);
      output.onToolEvent({ callId: `2`, label: `Read file`, status: `running` });
      output.onToolEvent({ callId: `2`, label: `Read file`, status: `completed` });
      output.succeed();

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Search project
        CURSOR 0
        WRITE \\r⠙ Search project
        CURSOR 0
        CLEAR 0
        LOG ✓ Search project
        WRITE \\n
        CURSOR 0
        WRITE \\r⠙ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        LOG 
        LOG First answer block
        WRITE \\n
        CURSOR 0
        WRITE \\r⠙ Read file
        CURSOR 0
        CLEAR 0
        LOG ✓ Read file
        WRITE \\n
        CURSOR 0
        WRITE \\r⠙ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`deduplicates repeated tool events snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);

      output.onToolEvent({ callId: `dup`, label: `Semantic search`, status: `running` });
      output.onToolEvent({ callId: `dup`, label: `Semantic search`, status: `running` });
      output.onToolEvent({ callId: `dup`, label: `Semantic search`, status: `completed` });
      output.onToolEvent({ callId: `dup`, label: `Semantic search`, status: `completed` });
      startThinking(output);
      finishThinking(output);
      output.succeed();

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`, `Semantic search`, `Thought`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Semantic search
        CURSOR 0
        WRITE \\r⠋ Semantic search
        CURSOR 0
        CLEAR 0
        LOG ✓ Semantic search
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`ignores late events after success snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.assistantMessage(``);
      output.succeed();

      output.assistantMessage(`late assistant`);
      output.onToolEvent({ callId: `late`, label: `late tool`, status: `running` });
      output.onToolEvent({ callId: `late`, label: `late tool`, status: `completed` });
      output.fail(`late error`);

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`renders fail flow snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.onToolEvent({ callId: `1`, label: `Run tool`, status: `running` });
      vi.advanceTimersByTime(120);

      output.fail(`boom`);

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`, `boom`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Run tool
        CURSOR 0
        WRITE \\r⠙ Run tool
        CURSOR 0
        CLEAR 0
        ERR boom"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`trims trailing newlines snapshot`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.assistantMessage(`Understood!\n\n`);
      startThinking(output);
      finishThinking(output);
      output.onToolEvent({ callId: `1`, label: `Searched semantic`, status: `running` });
      output.onToolEvent({ callId: `1`, label: `Searched semantic`, status: `completed` });
      startThinking(output);
      finishThinking(output);
      output.succeed();

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`, `Understood!`, `Searched semantic`, `Thought`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        LOG 
        LOG Understood!
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Searched semantic
        CURSOR 0
        CLEAR 0
        LOG ✓ Searched semantic
        WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });

  it(`streams assistant deltas progressively without duplicate final text`, () => {
    setupStatusOutput();
    const output = StatusOutput();
    try {
      output.start();
      startThinking(output);
      finishThinking(output);
      output.assistantDelta(`Hello`);
      vi.advanceTimersByTime(240);
      output.assistantDelta(` world`);
      vi.advanceTimersByTime(240);
      output.assistantMessage(`Hello world`);
      output.succeed();

      assertNoAdjacentSeparators();
      assertSingleEmptyLineBetweenCommitted();

      expect(committedMessagesWithoutIcon()).toStrictEqual([`Thought`]);
      expect(snapshotLog()).toMatchInlineSnapshot(`
        "WRITE \\n
        CURSOR 0
        WRITE \\r⠋ Thinking...
        CURSOR 0
        CLEAR 0
        LOG ✓ Thought
        LOG 
        WRITE Hello
        WRITE  world
        WRITE \\n"
      `);
    } finally {
      cleanupStatusOutput();
    }
  });
});
