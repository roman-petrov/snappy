import { Terminal } from "@snappy/node";

const palette = {
  accent: (text: string) => Terminal.cyan(text),
  dim: (text: string) => Terminal.dim(text),
  error: (text: string) => Terminal.red(text),
  success: (text: string) => Terminal.green(text),
  warning: (text: string) => Terminal.yellow(text),
};

const appName = (text: string) => Terminal.bold(palette.accent(text));
const command = (text: string) => palette.accent(text);
const dim = (text: string) => Terminal.dim(text);
const error = (text: string) => Terminal.bold(palette.error(text));
const indexReady = (text: string) => palette.success(text);
const indexStart = (text: string) => Terminal.bold(palette.accent(text));
const progressArrow = (text: string) => `${palette.accent(`→`)} ${palette.dim(text)}`;
const toolCompleted = (text: string) => `${Terminal.bold(palette.success(`✓`))} ${palette.dim(text)}`;

const toolRunning = ({ frame, text }: { frame: string; text: string }) =>
  `${Terminal.bold(palette.accent(frame))} ${palette.accent(text)}`;

const title = (text: string) => Terminal.bold(palette.accent(text));
const warning = (text: string) => palette.warning(text);

export const Theme = {
  appName,
  command,
  dim,
  error,
  indexReady,
  indexStart,
  progressArrow,
  title,
  toolCompleted,
  toolRunning,
  warning,
};
