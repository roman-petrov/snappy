// cspell:word AQID
import { describe, expect, it, vi } from "vitest";

import { ToolContext } from "./ToolContext";

const { publishImage } = ToolContext;const generate = (content: string) => vi.fn().mockResolvedValue({ artifactId: `art-1`, content });

describe(`publishImage`, () => {
  it(`feeds a data url to models for relative published urls`, async () => {
    vi.stubGlobal(`fetch`, () => new Response(new Uint8Array([1, 2, 3]), { headers: { "Content-Type": `image/png` } }));

    const media: Record<string, string> = {};

    const result = await publishImage({
      generate: generate(`/api/image/x.png`),
      input: {},
      isStopped: () => false,
      media,
    });

    expect(media[`art-1`]).toBe(`data:image/png;base64,AQID`);
    expect(result).toMatchObject({ context: [{ type: `text` }, { type: `image`, url: `data:image/png;base64,AQID` }] });
  });

  it(`keeps existing data urls without fetching`, async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal(`fetch`, fetchMock);

    const media: Record<string, string> = {};
    await publishImage({ generate: generate(`data:image/png;base64,AQID`), input: {}, isStopped: () => false, media });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(media[`art-1`]).toBe(`data:image/png;base64,AQID`);
  });
});
