import type { RelayOfferedModel } from "@snappy/server-api";

/** Best-effort chat vs image from model id; client may replace with explicit metadata later. */
const imageByNameHint = (name: string): boolean =>
  /dall-e|diffusion|dreamshaper|flux|sd-|sdxl|sd_|stable-diffusion|\bz-image/iu.test(name);

export const relayOffered = (names: readonly string[]): RelayOfferedModel[] =>
  names.map(name => ({ capabilities: imageByNameHint(name) ? ([`image`] as const) : ([`chat`] as const), name }));
