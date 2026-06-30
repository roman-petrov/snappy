import type { Locale } from "@snappy/intl";

import { AgentTool } from "@snappy/agent";
import { _ } from "@snappy/core";
import { Skills } from "@snappy/snappy-skills";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

import { Skill } from "../Skill";

export const SkillTool: SnappyToolFactory = ({ isStopped }) => {
  const registry = Skill.parse(Skills);
  const skillById = _.fromEntries(registry.map(skill => [skill.id, skill]));

  const name = (id: string, locale: Locale) => {
    const value = skillById[id]?.meta.name;

    return value === undefined ? id : locale === `ru` ? value.ru : value.en;
  };

  return AgentTool({
    description: [
      [
        `when`,
        `Use when you need domain-specific guidance before drafting prompts, asking clarifications, or generating the final output.`,
      ],
      [
        `input`,
        `Use mode "list" to discover available skills. Use mode "load" with a selected id to retrieve the full markdown skill.`,
      ],
      [`output`, `Returns either a JSON list of skills or markdown content for the selected skill.`],
    ],
    execute: async input => {
      if (isStopped()) {
        return ``;
      }
      if (input.mode === `load` && input.id === undefined) {
        return { error: `Skill id is required when mode is load.` };
      }
      const value = input.mode === `list` ? undefined : skillById[input.id ?? ``];
      const missingId = input.mode === `list` || value !== undefined ? `` : (input.id ?? ``);

      const payload =
        input.mode === `list`
          ? { skills: registry.map(({ id, meta }) => ({ description: meta.description, id, name: meta.name })) }
          : value === undefined
            ? undefined
            : { content: value.content, id: input.id ?? ``, name: value.meta.name.en, nameI18n: value.meta.name };

      const resolved = await Promise.resolve(payload);

      if (isStopped()) {
        return ``;
      }

      return resolved === undefined
        ? { error: `Unknown skill id "${missingId}".` }
        : JSON.stringify(resolved, undefined, 2);
    },
    formatCall: (input, status, locale) => {
      if (input.mode === `list`) {
        return locale === `ru`
          ? status === `running`
            ? `Открываю каталог навыков`
            : `Каталог навыков загружен`
          : status === `running`
            ? `Opening skills catalog`
            : `Skills catalog loaded`;
      }
      const id = input.id ?? ``;

      return locale === `ru`
        ? status === `running`
          ? `Загружаю навык: ${name(id, `ru`)}`
          : `Навык загружен: ${name(id, `ru`)}`
        : status === `running`
          ? `Loading skill: ${name(id, `en`)}`
          : `Skill loaded: ${name(id, `en`)}`;
    },
    inputSchema: z.object({
      id: z
        .enum(registry.map(({ id }) => id))
        .optional()
        .describe(`Skill id from the catalog. Required when mode is load.`),
      mode: z
        .enum([`list`, `load`])
        .describe(`list: return the skills catalog. load: return markdown for one skill (id required).`),
    }),
  });
};
