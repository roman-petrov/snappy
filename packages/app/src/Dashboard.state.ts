import { Clipboard } from "@snappy/browser";
import { _, Timer } from "@snappy/core";
import { Snappy, type SnappyOptions } from "@snappy/domain";
import { useAsyncEffectOnce, useGo, useIsMobile } from "@snappy/ui";
import { useState } from "react";

import { api } from "./core";

export const useDashboardState = () => {
  const go = useGo();
  const [options, setOptions] = useState(Snappy.defaultOptions);
  const [text, setText] = useState(``);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const mobile = useIsMobile();

  useAsyncEffectOnce(async () => {
    const response = await api.remaining(``);

    setOptions(response.options);
    if (response.remaining === 0 && response.isPremium !== true) {
      void go(`/limit`, { replace: true });
    }
  });

  const processText = async () => {
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    const processResult = await api.process(``, text.trim(), options);
    setLoading(false);
    if (processResult.status !== `ok`) {
      if (processResult.status === `requestLimitReached`) {
        void go(`/limit`, { replace: true });

        return;
      }
      setError(processResult.status);

      return;
    }
    setResult(processResult.text);
    setCopied(false);
    setIsEditMode(false);
  };

  const switchToEdit = () => setIsEditMode(true);

  const clear = () => {
    setText(``);
    setResult(``);
    setError(``);
    setIsEditMode(true);
  };

  const copyResult = () => {
    void Clipboard.copy(result).then(() => {
      setCopied(true);
      Timer.timeout(() => setCopied(false), _.second * 2);

      return undefined;
    });
  };

  const setOption = <K extends keyof SnappyOptions>(key: K, value: SnappyOptions[K]) =>
    setOptions(previous => ({ ...previous, [key]: value }));

  const showResult = !isEditMode && result !== ``;

  return {
    clear,
    copied,
    copyResult,
    error,
    loading,
    mobile,
    options,
    processText,
    result,
    setOption,
    setText,
    showResult,
    switchToEdit,
    text,
  };
};
