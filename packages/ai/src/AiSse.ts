/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
const dataPrefix = `data: `;

const parseDataLine = (line: string) => {
  if (!line.startsWith(dataPrefix)) {
    return undefined;
  }
  const raw = line.slice(dataPrefix.length).trim();
  if (raw === `[DONE]` || raw === ``) {
    return undefined;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
};

const jsonChunks = (body: ReadableStream<Uint8Array>): AsyncIterable<unknown> =>
  (async function* chunks() {
    const decoder = new TextDecoder();
    const reader = body.getReader();
    let carry = ``;

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        carry += decoder.decode(value, { stream: true });
        const lines = carry.split(`\n`);
        carry = lines.at(-1) ?? ``;
        for (const line of lines.slice(0, -1)) {
          const parsed = parseDataLine(line);
          if (parsed !== undefined) {
            yield parsed;
          }
        }
      }
      carry += decoder.decode();
      const parsed = parseDataLine(carry);
      if (parsed !== undefined) {
        yield parsed;
      }
    } finally {
      reader.releaseLock();
    }
  })();

export const AiSse = { jsonChunks };
