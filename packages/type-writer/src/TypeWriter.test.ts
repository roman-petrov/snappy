/* @vitest-environment jsdom */
/* eslint-disable functional/no-this-expressions */
/* eslint-disable unicorn/no-this-outside-of-class */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import { TypeWriter } from "./TypeWriter";
import styles from "./TypeWriter.module.scss";

const unitPx = 10;
Range.prototype.getClientRects = function getClientRects(this: Range) {
  return [{ width: (this.endOffset - this.startOffset) * unitPx }] as unknown as DOMRectList;
};

const fastCharsPerSecond = 1024 / unitPx;
const mediumCharsPerSecond = 512 / unitPx;
const tickMs = 50;

type Sample = { chars: number; seconds: number };

type Timing = {
  advance: (ms: number) => Promise<void>;
  finish: (pending: Promise<boolean>) => Promise<boolean>;
  nextFrame: () => Promise<void>;
  sampleReveal: (revealed: () => number, ms: number) => Promise<Sample[]>;
  sleep: (ms: number) => Promise<void>;
  stall: (ms: number) => Promise<void>;
  stream: (writer: TypeWriter, full: string, wrap: (part: string) => string) => () => void;
  until: (predicate: () => boolean, maxMs?: number) => Promise<void>;
};

const hostElement = (parent: HTMLElement = document.body) => {
  const host = document.createElement(`div`);
  parent.append(host);

  return host;
};

const mount = (html: string) => {
  const root = document.createElement(`div`);
  root.innerHTML = html;
  document.body.append(root);

  return root;
};

const fastWriter = (host: HTMLElement) => {
  const writer = TypeWriter();
  writer.attach(host);
  writer.setSpeed(`fast`);
  writer.setWaiting(true);

  return writer;
};

const chars = (root: ParentNode, selector: string) => () => (root.querySelector(selector)?.textContent ?? ``).length;

const expectSmooth = (samples: readonly Sample[], charsPerSecond: number, from?: Sample) => {
  const base = from ?? { chars: 0, seconds: 0 };
  let previous = base;

  for (const sample of samples) {
    expect(sample.chars).toBeGreaterThanOrEqual(previous.chars);
    expect(sample.chars).toBeLessThanOrEqual(base.chars + (sample.seconds - base.seconds) * charsPerSecond + 3);

    previous = sample;
  }
};

const withTiming = async (run: (timing: Timing) => Promise<void> | void) => {
  vi.useFakeTimers({
    toFake: [`setTimeout`, `setInterval`, `requestAnimationFrame`, `cancelAnimationFrame`, `performance`],
  });

  const advance = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
  };

  const nextFrame = async () => {
    await advance(tickMs);
  };

  const sleep = async (ms: number) => {
    await advance(ms);
  };

  const finish = async (pending: Promise<boolean>) => {
    for (let steps = 0; steps < 500; steps += 1) {
      const value = await Promise.race([pending, advance(tickMs).then(() => undefined)]);
      if (typeof value === `boolean`) {
        return value;
      }
    }

    return pending;
  };

  const until = async (predicate: () => boolean, maxMs = 2000) => {
    let elapsed = 0;

    while (!predicate() && elapsed < maxMs) {
      await advance(tickMs);
      elapsed += tickMs;
    }
  };

  const sampleReveal = async (revealed: () => number, ms: number) => {
    const samples: Sample[] = [];
    let elapsed = 0;

    while (elapsed < ms) {
      await advance(tickMs);
      elapsed += tickMs;
      samples.push({ chars: revealed(), seconds: elapsed / 1000 });
    }

    return samples;
  };

  const stream = (writer: TypeWriter, full: string, wrap: (part: string) => string) => {
    let sent = 0;

    const id = setInterval(() => {
      sent = Math.min(full.length, sent + 6);
      void writer.push(wrap(full.slice(0, sent)));
      if (sent >= full.length) {
        clearInterval(id);
      }
    }, 30);

    return () => {
      clearInterval(id);
    };
  };

  const stall = async (ms: number) => {
    vi.setSystemTime(performance.now() + ms);
    await nextFrame();
  };

  try {
    await run({ advance, finish, nextFrame, sampleReveal, sleep, stall, stream, until });
  } finally {
    vi.useRealTimers();
    document.body.replaceChildren();
  }
};

describe(`push`, () => {
  it(`resolves true for empty content without host`, async () => {
    await withTiming(async ({ finish }) => {
      const writer = TypeWriter();

      await expect(finish(writer.push(``))).resolves.toBe(true);
    });
  });

  it(`resolves superseded push with false`, async () => {
    await withTiming(async () => {
      const writer = TypeWriter();
      const first = writer.push(`<p>hello</p>`);
      const second = writer.push(``);

      await expect(first).resolves.toBe(false);
      await expect(second).resolves.toBe(true);
    });
  });

  it(`resolves true for void-only html`, async () => {
    await withTiming(async ({ finish }) => {
      const writer = fastWriter(hostElement());

      await expect(finish(writer.push(`<hr>`))).resolves.toBe(true);
    });
  });

  it(`types text and resolves true with host`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>hello</p>`))).resolves.toBe(true);
      expect(host.textContent).toContain(`hello`);
    });
  });

  it(`resolves repeated identical html`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>same</p>`))).resolves.toBe(true);
      await expect(finish(writer.push(`<p>same</p>`))).resolves.toBe(true);
      expect(host.textContent).toContain(`same`);
    });
  });

  it(`hides empty trailing blocks under the caret`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>done</p><p></p>`))).resolves.toBe(true);

      const [first, second] = host.querySelectorAll(`p`);

      expect(first?.style.display).toBe(``);
      expect(second?.style.display).toBe(`none`);
    });
  });

  it(`keeps unrevealed blocks hidden despite theme display rules`, async () => {
    await withTiming(async ({ finish }) => {
      const style = document.createElement(`style`);
      style.textContent = `p { display: block; }`;
      document.head.append(style);
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>done</p><p></p>`))).resolves.toBe(true);

      const [, second] = host.querySelectorAll(`p`);

      expect(second === undefined ? `` : getComputedStyle(second).display).toBe(`none`);

      style.remove();
      writer.destroy();
    });
  });

  it(`drops the bottom margin of the last visible block while trailing blocks are hidden`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>done</p><p></p>`))).resolves.toBe(true);
      expect(host.querySelector(`p`)?.style.marginBlockEnd).toBe(`0px`);

      await expect(finish(writer.push(`<p>done</p><p>more</p>`))).resolves.toBe(true);
      expect(host.querySelector(`p`)?.style.marginBlockEnd).toBe(``);
    });
  });

  it(`retypes from the divergence point when content changes`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>abcdef</p>`))).resolves.toBe(true);
      await expect(finish(writer.push(`<p>abcXYZ</p>`))).resolves.toBe(true);
      expect(host.querySelector(`p`)?.textContent).toBe(`abcXYZ`);
    });
  });

  it(`reveals buffered content at linear speed, keeping the caret visible`, async () => {
    await withTiming(async ({ nextFrame }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      void writer.push(`<p>${`word `.repeat(30).trim()}</p>`);
      const revealed = chars(host, `p`);
      let elapsed = 0;
      let previous = 0;

      while (elapsed < 350) {
        await nextFrame();
        elapsed += tickMs;
        const caret = host.querySelector(`.${styles.root}`);

        expect(revealed()).toBeGreaterThanOrEqual(previous);
        expect(revealed()).toBeLessThanOrEqual((elapsed / 1000) * fastCharsPerSecond + 3);
        expect(caret).not.toBeNull();
        expect(caret?.classList.contains(styles.hidden)).toBe(false);

        previous = revealed();
      }

      expect(previous).toBeGreaterThan(5);

      writer.destroy();
    });
  });

  it(`reveals a growing paragraph stream smoothly`, async () => {
    await withTiming(async ({ sampleReveal, stream }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      const full = `alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima`;
      const stop = stream(writer, full, part => `<p>${part}</p>`);
      const samples = await sampleReveal(chars(host, `p`), 450);
      stop();
      writer.destroy();

      expectSmooth(samples, fastCharsPerSecond);

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThan(10);
    });
  });

  it(`reveals a growing code block smoothly`, async () => {
    await withTiming(async ({ sampleReveal, stream }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      const full = `const alpha = 1;\nconst bravo = 2;\nconst charlie = 3;\nconst delta = 4;`;

      const stop = stream(
        writer,
        full,
        part => `<pre><code class="lang-ts"><span class="line">${part}</span></code></pre>`,
      );

      const samples = await sampleReveal(chars(host, `pre > code`), 450);
      stop();
      writer.destroy();

      expectSmooth(samples, fastCharsPerSecond);

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThan(10);
    });
  });

  it(`reveals a growing table cell smoothly`, async () => {
    await withTiming(async ({ sampleReveal, stream }) => {
      const root = mount(`<table><tbody><tr><td></td></tr></tbody></table>`);
      const cell = root.querySelector(`td`);

      expect(cell).not.toBeNull();

      const writer = fastWriter(hostElement(cell ?? root));
      const full = `one two three four five six seven eight nine ten eleven twelve`;
      const stop = stream(writer, full, part => `<strong>${part}</strong>`);
      const samples = await sampleReveal(chars(root, `td`), 450);
      stop();
      writer.destroy();

      expectSmooth(samples, fastCharsPerSecond);

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThan(10);
    });
  });

  it(`reveals a growing list item smoothly`, async () => {
    await withTiming(async ({ sampleReveal, stream }) => {
      const root = mount(`<ul><li></li></ul>`);
      const item = root.querySelector(`li`);

      expect(item).not.toBeNull();

      const writer = fastWriter(hostElement(item ?? root));
      const full = `first point second point third point fourth point fifth point`;
      const stop = stream(writer, full, part => `${part.slice(0, 5)}<em>${part.slice(5)}</em>`);
      const samples = await sampleReveal(chars(root, `li`), 450);
      stop();
      writer.destroy();

      expectSmooth(samples, fastCharsPerSecond);

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThan(10);
    });
  });

  it(`keeps progress when markup changes around a stable text prefix`, async () => {
    await withTiming(async ({ sampleReveal, until }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      void writer.push(`<p>alpha beta gamma</p>`);
      const revealed = chars(host, `p`);

      await until(() => revealed() >= 6);

      const before = revealed();
      void writer.push(`<p>alpha <strong>beta</strong> gamma delta epsilon</p>`);
      const samples = await sampleReveal(revealed, 200);
      writer.destroy();

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThanOrEqual(before);

      expectSmooth(samples, fastCharsPerSecond, { chars: before, seconds: 0 });
    });
  });

  it(`stays smooth when the speed changes mid-reveal`, async () => {
    await withTiming(async ({ sampleReveal }) => {
      const host = hostElement();
      const writer = TypeWriter();
      writer.attach(host);
      writer.setWaiting(true);
      void writer.push(`<p>${`word `.repeat(30).trim()}</p>`);
      const revealed = chars(host, `p`);
      const slow = await sampleReveal(revealed, 150);
      writer.setSpeed(`fast`);
      const fast = await sampleReveal(revealed, 200);
      writer.destroy();

      expect(fast.at(-1)?.chars ?? 0).toBeGreaterThan(slow.at(-1)?.chars ?? 0);

      expectSmooth(slow, mediumCharsPerSecond);
      expectSmooth(fast, fastCharsPerSecond, { chars: slow.at(-1)?.chars ?? 0, seconds: 0 });
    });
  });

  it(`reveals a growing table smoothly`, async () => {
    await withTiming(async ({ sampleReveal, stream }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      const full = `one two three four five six seven eight nine ten eleven twelve`;

      const tableFrom = (part: string) => {
        const cells = part.split(` `);

        const rows = _.gen(
          Math.ceil(cells.length / 3),
          row =>
            `<tr>${cells
              .slice(row * 3, row * 3 + 3)
              .map(cell => `<td>${cell}</td>`)
              .join(``)}</tr>`,
        );

        return `<table><tbody>${rows.join(``)}</tbody></table>`;
      };

      const stop = stream(writer, full, tableFrom);
      const samples = await sampleReveal(chars(host, `table`), 450);
      stop();
      writer.destroy();

      expectSmooth(samples, fastCharsPerSecond);

      expect(samples.at(-1)?.chars ?? 0).toBeGreaterThan(10);
    });
  });

  it(`advances by at most one frame's worth after a main-thread stall`, async () => {
    await withTiming(async ({ stall, until }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      void writer.push(`<p>${`a`.repeat(200)}</p>`);
      const revealed = chars(host, `p`);

      await until(() => revealed() >= 5);

      const before = revealed();
      await stall(150);
      const after = revealed();
      writer.destroy();

      expect(after).toBeGreaterThanOrEqual(before);
      expect(after - before).toBeLessThanOrEqual(8);
    });
  });

  it(`does not rescan the DOM while the caret stays in one text node`, async () => {
    await withTiming(async ({ sampleReveal, until }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      void writer.push(`<p>${`a`.repeat(200)}</p>`);
      const revealed = chars(host, `p`);

      await until(() => revealed() >= 3);

      const spy = vi.spyOn(Element.prototype, `querySelectorAll`);
      await sampleReveal(revealed, 200);
      const scans = spy.mock.calls.length;
      spy.mockRestore();
      writer.destroy();

      expect(scans).toBe(0);
    });
  });

  it(`touches only the caret's text nodes per frame across many nodes`, async () => {
    await withTiming(async ({ nextFrame, until }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      const html = `<p>${_.gen(40, index => `<span>word${index}</span>`).join(``)}</p>`;
      void writer.push(html);
      const revealed = chars(host, `p`);

      await until(() => revealed() >= 10);

      const spy = vi.spyOn(Node.prototype, `textContent`, `set`);
      const frames = 10;

      for (let index = 0; index < frames; index += 1) {
        await nextFrame();
      }

      const writes = spy.mock.calls.length;
      spy.mockRestore();
      writer.destroy();

      expect(writes).toBeLessThanOrEqual(frames * 4 * Math.ceil(tickMs / 16));
    });
  });

  it(`measures each grapheme once across a growing stream`, async () => {
    await withTiming(async ({ finish }) => {
      const host = hostElement();
      const writer = fastWriter(host);
      const full = `alpha bravo charlie delta echo foxtrot`;
      const spy = vi.spyOn(Range.prototype, `getClientRects`);

      for (let sent = 6; sent < full.length + 6; sent += 6) {
        await finish(writer.push(`<p>${full.slice(0, sent)}</p>`));
      }

      const calls = spy.mock.calls.length;
      spy.mockRestore();
      writer.destroy();

      expect(calls).toBe(full.length);
    });
  });

  it(`continues without a burst after waiting for data`, async () => {
    await withTiming(async ({ finish, nextFrame, sleep }) => {
      const host = hostElement();
      const writer = fastWriter(host);

      await expect(finish(writer.push(`<p>${`a`.repeat(10)}</p>`))).resolves.toBe(true);

      await sleep(200);

      const revealed = chars(host, `p`);
      const before = revealed();
      void writer.push(`<p>${`a`.repeat(50)}</p>`);
      await nextFrame();
      const after = revealed();
      writer.destroy();

      expect(before).toBe(10);
      expect(after).toBeGreaterThanOrEqual(before);
      expect(after - before).toBeLessThanOrEqual(8);
    });
  });
});

describe(`setWaiting`, () => {
  it(`shows the caret while waiting without content`, async () => {
    await withTiming(() => {
      const host = hostElement();
      const writer = TypeWriter();
      writer.attach(host);
      writer.setWaiting(true);
      const caret = host.querySelector(`.${styles.root}`);

      expect(caret).not.toBeNull();
      expect(caret?.classList.contains(styles.hidden)).toBe(false);

      writer.destroy();
    });
  });
});

describe(`attach`, () => {
  it(`shows a waiting caret instead of stale content on a new host`, async () => {
    await withTiming(async ({ finish }) => {
      const writer = fastWriter(hostElement());

      await expect(finish(writer.push(`<p>old segment</p>`))).resolves.toBe(true);

      const second = hostElement();
      writer.attach(second);

      expect(second.textContent).toBe(``);
      expect(second.querySelector(`.${styles.root}`)).not.toBeNull();
    });
  });
});

describe(`destroy`, () => {
  it(`settles pending push with false`, async () => {
    await withTiming(async () => {
      const writer = TypeWriter();
      const pending = writer.push(`<p>never shown</p>`);
      writer.destroy();

      await expect(pending).resolves.toBe(false);
    });
  });
});
