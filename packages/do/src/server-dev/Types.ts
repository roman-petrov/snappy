import type { Locale } from "@snappy/intl";
import type { ResolvedTheme } from "@snappy/ui-core";
import type { Request } from "express";

export type ServerDevHtml = (input: ServerDevHtmlInput) => void;

export type ServerDevHtmlBody = (input: {
  locale: Locale;
  template: string;
  theme: ResolvedTheme | undefined;
}) => Promise<string> | string;

export type ServerDevHtmlInput = {
  body: ServerDevHtmlBody;
  dir: string;
  documentUrl?: string;
  path: RegExp | string;
  skip?: (request: Request) => boolean;
};
