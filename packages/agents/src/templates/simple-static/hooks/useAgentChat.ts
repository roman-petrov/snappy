import { _ } from "@snappy/core";
import { Locale } from "@snappy/ui";
import { useEffect, useState } from "react";

import type {
  AgentChromeProps,
  AgentFeedItem,
  AgentSessionStep,
  AgentTools,
  AgentToolStepKind,
  FeedLine,
} from "../../../Types";

import { t } from "../../../locales";

export const useAgentChat = ({
  agentId,
  hostTools,
  maxPromptImageLength,
  maxSpeechFileMegaBytes,
}: AgentChromeProps) => {
  const [feedItems, setFeedItems] = useState<AgentFeedItem[]>([]);
  const [sessionSteps, setSessionSteps] = useState<AgentSessionStep[]>([]);
  const [error, setError] = useState(``);
  const [loading, setLoading] = useState(false);

  const appendFeed = (line: FeedLine) => {
    setFeedItems((previous: AgentFeedItem[]) => [...previous, { ...line, id: crypto.randomUUID() }]);
  };

  const endStep = (kind: AgentToolStepKind) => {
    const slot: { resolve?: () => void } = {};

    const done = new Promise<void>(resolve => {
      slot.resolve = () => resolve();
    });

    const label = t(`chat.tool.${kind}`);
    setSessionSteps(previous => [...previous, { done, id: crypto.randomUUID(), label }]);

    return () => {
      slot.resolve?.();
    };
  };

  const runFlow = async (fn: () => Promise<void>) => {
    setError(``);
    setLoading(true);
    setSessionSteps([]);
    try {
      await fn();
    } finally {
      setLoading(false);
    }
  };

  const locale = Locale.effective();

  const tools: AgentTools = {
    chat: async prompt => {
      const done = endStep(`chat`);
      try {
        return await hostTools.chat(prompt);
      } finally {
        done();
      }
    },
    image: async (prompt, options) => {
      const done = endStep(`image`);
      try {
        return await hostTools.image(prompt, options);
      } finally {
        done();
      }
    },
    speechRecognition: async file => {
      const done = endStep(`speechRecognition`);
      try {
        return await hostTools.speechRecognition(file);
      } finally {
        done();
      }
    },
    vectorize: async ({ imageBase64 }) => {
      const done = endStep(`vectorize`);

      return Promise.resolve(
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" data-in="${String((_.isString(imageBase64) ? imageBase64 : ``).length)}"><rect width="100%" height="100%" fill="#eee"/><text x="8" y="36" font-size="10">trace</text></svg>`,
      ).finally(done);
    },
  };

  useEffect(() => {
    setSessionSteps([]);
    setFeedItems([]);
  }, [agentId]);

  const viewProps = { appendFeed, loading, locale, maxPromptImageLength, maxSpeechFileMegaBytes, runFlow, tools };
  const surface = { error, feedItems, sessionSteps };

  return { surface, viewProps };
};
