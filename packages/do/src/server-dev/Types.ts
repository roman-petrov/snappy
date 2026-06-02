import type { SettingsCookie } from "@snappy/server";
import type { Request } from "express";

export type ServerDevHtml = (input: ServerDevHtmlInput) => void;

export type ServerDevHtmlBody = (
  input: ReturnType<typeof SettingsCookie> & { template: string },
) => Promise<string> | string;

export type ServerDevHtmlInput = {
  body: ServerDevHtmlBody;
  dir: string;
  documentUrl?: string;
  path: RegExp | string;
  skip?: (request: Request) => boolean;
};
