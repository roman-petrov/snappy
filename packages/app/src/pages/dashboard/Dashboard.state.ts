import { Snappy } from "@snappy/domain";
import { useAsyncEffectOnce } from "@snappy/ui";
import { useState } from "react";

import { api } from "../../core";

export const useDashboardState = () => {
  const [options, setOptions] = useState(Snappy.defaultOptions);
  const [text, setText] = useState(``);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [initLoading, setInitLoading] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);

  useAsyncEffectOnce(async () => {
    try {
      const response = await api.remaining();

      setOptions(response.options);
      if (response.remaining === 0 && response.isPremium !== true) {
        setLimitReached(true);
      }
    } finally {
      setInitLoading(false);
    }
  });

  const processText = async () => {
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setIsEditMode(false);
    setLoading(true);
    const processResult = await api.process(text.trim(), options);
    setLoading(false);
    if (processResult.status !== `ok`) {
      if (processResult.status === `requestLimitReached`) {
        setLimitReached(true);

        return;
      }
      setError(processResult.status);

      return;
    }
    setResult(processResult.text);
  };

  const showResult = !isEditMode && (loading || result !== ``);

  return {
    error,
    initLoading,
    limitReached,
    loading,
    options,
    processText,
    result,
    setOptions,
    setText,
    showResult,
    text,
  };
};
