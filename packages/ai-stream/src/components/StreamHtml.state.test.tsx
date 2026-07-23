/* @vitest-environment jsdom */
import { act, render } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { StreamHtml } from "./StreamHtml";

describe(`StreamHtml`, () => {
  it(`preserves an existing pre when leaving the typewriter host`, () => {
    const Harness = () => {
      const [tail, setTail] = useState(true);

      return (
        <>
          <StreamHtml
            html="<pre><code>seeded</code></pre>"
            tailHostRef={
              tail
                ? (host: HTMLDivElement | null) => {
                    if (host !== null && host.querySelector(`pre`) === null) {
                      host.innerHTML = `<pre><code>typed</code></pre>`;
                    }
                  }
                : undefined
            }
          />
          <button onClick={() => setTail(false)} type="button">
            leave
          </button>
        </>
      );
    };

    const { container, getByRole } = render(<Harness />);
    const host = container.querySelector(`div`);

    expect(host?.querySelector(`pre`)?.textContent).toBe(`typed`);

    act(() => {
      getByRole(`button`, { name: `leave` }).click();
    });

    expect(host?.querySelector(`pre`)?.textContent).toBe(`typed`);
  });

  it(`applies static html when there was no typewriter content`, () => {
    const { container } = render(<StreamHtml html="<pre><code>static</code></pre>" />);

    expect(container.querySelector(`pre`)?.textContent).toBe(`static`);
  });

  it(`upgrades plain marked code html to shiki`, () => {
    const Harness = () => {
      const [html, setHtml] = useState(`<pre><code class="language-ts">const x = 1;</code></pre>`);

      return (
        <>
          <StreamHtml html={html} />
          <button
            onClick={() => {
              setHtml(`<pre class="shiki dark-plus"><code><span style="color:#9cdcfe">const</span></code></pre>`);
            }}
            type="button"
          >
            paint
          </button>
        </>
      );
    };

    const { container, getByRole } = render(<Harness />);

    expect(container.querySelector(`pre`)?.className).toBe(``);

    act(() => {
      getByRole(`button`, { name: `paint` }).click();
    });

    expect(container.querySelector(`pre.shiki`)).not.toBeNull();
    expect(container.querySelector(`span[style]`)?.textContent).toBe(`const`);
  });
});
