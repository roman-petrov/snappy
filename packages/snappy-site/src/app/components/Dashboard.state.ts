import { useEffect, useState } from "react";

import { api, defaultFeature, featureEmoji, featureKeys, type FeatureType, t } from "../core";

const copyFeedbackMs = 2000;

export const useDashboardState = () => {
  const [remaining, setRemaining] = useState<number | undefined>(undefined);
  const [text, setText] = useState(``);
  const [feature, setFeature] = useState<FeatureType>(defaultFeature);
  const [result, setResult] = useState(``);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api
      .remaining(``)
      .then(({ remaining: count }) => {
        setRemaining(count);

        return undefined;
      })
      .catch(() => undefined);
  }, []);

  const processText = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    try {
      const { text: processed } = await api.process(``, text.trim(), feature);
      setResult(processed);
      setCopied(false);
      if (remaining !== undefined) {
        setRemaining(remaining - 1);
      }
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : t(`dashboard.errorNetwork`));
    } finally {
      setLoading(false);
    }
  };

  const openPremium = async () => {
    try {
      const { url } = await api.premiumUrl(``);
      window.open(url, `_blank`);
    } catch {
      //
    }
  };

  const copyResult = () => {
    void navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, copyFeedbackMs);

      return undefined;
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
