/* eslint-disable react-hooks/exhaustive-deps */
import { type EffectCallback, useEffect } from "react";

export const useEffectOnce = (fn: EffectCallback) => useEffect(fn, []);
