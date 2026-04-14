import { Terminal } from "@snappy/node";

const appName = (text: string) => Terminal.bold.cyan(text);
const command = (text: string) => Terminal.cyan(text);
const dim = (text: string) => Terminal.dim(text);
const error = (text: string) => Terminal.red.bold(text);
const indexReady = (text: string) => Terminal.green(text);
const indexStart = (text: string) => Terminal.bold.cyan(text);
const progressArrow = (text: string) => `${Terminal.cyan(`→`)} ${Terminal.dim(text)}`;
const toolCompleted = (text: string) => `${Terminal.green.bold(`✓`)} ${Terminal.dim(text)}`;

const toolRunning = ({ frame, text }: { frame: string; text: string }) =>
  `${Terminal.cyan.bold(frame)} ${Terminal.cyan(text)}`;

const title = (text: string) => Terminal.bold.cyan(text);
const warning = (text: string) => Terminal.yellow(text);

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
