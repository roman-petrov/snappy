/* @vitest-environment node */
import { HttpConstants } from "@snappy/core";
import { describe, expect, it } from "vitest";

import { TunnelClient } from "./TunnelClient";

describe(`stop`, () => {
  it(`stops a client that failed to connect`, () => {
    const client = TunnelClient({ key: `k`, url: `ws://${HttpConstants.loopback}:1` });

    expect(() => client.stop()).not.toThrow();
  });
});
