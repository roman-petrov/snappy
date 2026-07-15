/* eslint-disable functional/no-expression-statements */
import type { ReadonlyStore } from "@snappy/core";

import { Dom } from "@snappy/browser";
import { Bridge, Platform } from "@snappy/platform";
import { useStoreValue } from "@snappy/store";
import { useEffect } from "react";

export type ShakeHostProps = { action: () => void; signedIn: ReadonlyStore<boolean> };

export const ShakeHost = ({ action, signedIn }: ShakeHostProps) => {
  const isSignedIn = useStoreValue(signedIn);
  const enabled = Platform() === `native` && isSignedIn;

  useEffect(() => (enabled ? Dom.subscribe(window, Bridge.shakeEvent, action) : undefined), [action, enabled]);

  return undefined;
};
