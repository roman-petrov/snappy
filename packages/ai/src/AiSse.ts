/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */

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
          if (!line.startsWith(`data: `)) {
            continue;
          }
          const raw = line.slice(`data: `.length).trim();
          if (raw === `[DONE]` || raw === ``) {
            continue;
          }
          try {
            yield JSON.parse(raw) as unknown;
          } catch {
            /* Non-JSON line */
          }
        }
      }
      carry += decoder.decode();
      if (carry.startsWith(`data: `)) {
        const raw = carry.slice(`data: `.length).trim();
        if (raw !== `[DONE]` && raw !== ``) {
          try {
            yield JSON.parse(raw) as unknown;
          } catch {
            /* Ignore */
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  })();

export const AiSse = { jsonChunks };
