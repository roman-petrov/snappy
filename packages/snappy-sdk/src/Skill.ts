import { _ } from "@snappy/core";

const parse = (rawSkills: Record<string, string>) => {
  const readValue = (line: string | undefined, key: string) =>
    line === undefined
      ? ``
      : ((value: string) =>
          (value.startsWith(`"`) && value.endsWith(`"`)) || (value.startsWith(`'`) && value.endsWith(`'`))
            ? value.slice(1, -1)
            : value)(line.trimStart().slice(`${key}:`.length).trim());

  return _.entries(rawSkills)
    .map(([path, raw]) => {
      const lines = raw.split(/\r?\n/u);
      const separator = lines[0] === `---` ? lines.slice(1).indexOf(`---`) : -1;
      const metaLines = separator === -1 ? [] : lines.slice(1, separator + 1);
      const dotMd = path.includes(`.md`) ? path.lastIndexOf(`.md`) : path.length;

      return {
        content: (separator === -1 ? lines : lines.slice(separator + 2)).join(`\n`).trim(),
        id: path.slice(path.lastIndexOf(`/`) + 1, dotMd),
        meta: {
          description: readValue(
            metaLines.find(line => line.startsWith(`description:`)),
            `description`,
          ),
          name: {
            en: readValue(
              metaLines.find(line => line.trimStart().startsWith(`en:`)),
              `en`,
            ),
            ru: readValue(
              metaLines.find(line => line.trimStart().startsWith(`ru:`)),
              `ru`,
            ),
          },
        },
      };
    })
    .toSorted((a, b) => a.id.localeCompare(b.id));
};

export const Skill = { parse };
