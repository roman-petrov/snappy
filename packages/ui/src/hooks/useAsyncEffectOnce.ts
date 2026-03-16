import { useAsyncEffect } from "./useAsyncEffect";

export const useAsyncEffectOnce = (fn: () => Promise<void>) => useAsyncEffect(fn, []);
