import { useEffect, useState } from "react";

import { AnimatedFavicon, api, defaultFeature, featureEmoji, featureKeys, type FeatureType, t } from "../core";

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
    void (async () => {
      const response = await api.remaining(``);

      setRemaining(response.remaining);
    })();
  }, []);

  const processText = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setError(``);
    setResult(``);
    if (text.trim() === ``) {
      return;
    }
    setLoading(true);
    AnimatedFavicon.start();
    try {
      const processResult = await api.process(``, text.trim(), feature);
      if (processResult.status !== `ok`) {
        setError(t(`dashboard.errors.${processResult.status}`));

        return;
      }
      setResult(processResult.text);
      setCopied(false);
      if (remaining !== undefined) {
        setRemaining(remaining - 1);
      }
    } finally {
      AnimatedFavicon.stop();
      setLoading(false);
    }
  };

  const openPremium = async () => {
    const response = await api.premiumUrl(``);
    if (response.status === `ok`) {
      window.open(response.url, `_blank`);
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
