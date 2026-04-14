import { Ai, type AiLocale } from "@snappy/ai";

export type AgentsAiOptions = ({ aiTunnelKey: string } | { url: string }) & { locale: AiLocale };

export const agentsAi = async (options: AgentsAiOptions) =>
  `url` in options
    ? Ai({ locale: options.locale, url: options.url })
    : Ai({ aiTunnelKey: options.aiTunnelKey, locale: options.locale });
