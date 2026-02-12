import { useEffect, useState } from "react";

import { api } from "../core/Api";
import { getToken } from "../core/Auth";
import { featureEmoji, featureKeys } from "../core/Features";
import { t } from "../core/Locale";

export const useDashboardState = () => {
  const token = getToken() ?? ``;
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [text, setText] = useState(``);
  const [feature, setFeature] = useState(featureKeys[0] ?? ``);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.remaining(token).then(async response => {
      if (response.ok) {
        const data = (await response.json()) as { remaining?: number };
        setRemaining(data.remaining);
      }
    });
  }, [token]);

  const processText = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    try {
      const response = await api.process(token, text.trim(), feature);
      const data = (await response.json()) as { error?: string; text?: string };
      if (!response.ok) {
        setError(data.error ?? t(`dashboard.error`));

        return;
      }
      setResult(data.text ?? ``);
      setCopied(false);
      if (typeof data.text === `string` && remaining !== undefined) {
        setRemaining(remaining - 1);
      }
    } catch {
      setError(t(`dashboard.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  const openPremium = async () => {
    try {
      const response = await api.premiumUrl(token);
      const data = (await response.json()) as { error?: string; url?: string };
      if (response.ok && data.url) {
        window.open(data.url, `_blank`);
      }
    } catch {
      //
    }
  };

  const copyResult = () => {
    void navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return {
    copied,
    error,
    feature,
    featureEmoji,
    featureKeys,
    loading,
    onCopyResult: copyResult,
    onFeatureChange: setFeature,
    onPremiumClick: openPremium,
    onSubmit: processText,
    onTextChange: setText,
    remaining,
    result,
    text,
  };
};
