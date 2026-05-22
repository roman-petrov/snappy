import { RemendEmphasis } from "./RemendEmphasis";

const stripRules = [
  { pattern: /\*\*\*/gu, replace: /(?<last>\S)\s*\*\*\*\s+$/u },
  { pattern: /(?<!\*)\*\*(?!\*)/gu, replace: /(?<last>\S)\s*\*\*\s+$/u },
  { pattern: /~~/gu, replace: /(?<last>\S)\s*~~\s+$/u },
  { pattern: /(?<!_)__(?!_)/gu, replace: /(?<last>\S)\s*__\s+$/u },
  { pattern: /(?<!`)`(?!`)/gu, replace: /(?<last>\S)\s*`\s+$/u },
] as const;

const applyStripRules = (
  line: string,
  rules: readonly { readonly pattern: RegExp; readonly replace: RegExp }[],
): string => {
  const [rule, ...rest] = rules;

  if (rule === undefined) {
    return line;
  }

  return applyStripRules(
    [...line.matchAll(rule.pattern)].length % 2 === 1 ? line.replace(rule.replace, `$<last>`) : line,
    rest,
  );
};

const stripAbandoned = (line: string) => applyStripRules(line, stripRules);
const finish = (line: string) => (RemendEmphasis.markerOnly(line) ? `` : stripAbandoned(line));

export const RemendLine = { finish };
