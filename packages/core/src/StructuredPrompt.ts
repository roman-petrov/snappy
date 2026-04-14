import { ObjectValue } from "./ObjectValue";

/**
 * We use XML-like tags trying to follow the best practices for prompt engineering.
 * Cursor IDE does the same in its system prompt.
 * ? https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#structure-prompts-with-xml-tags
 * ? https://theneuralbase.com/prompt-engineering/qna/how-to-use-xml-tags-in-claude-prompts/
 */
export type StructuredPrompt = Record<string, string>;

const create = (sections: StructuredPrompt) =>
  ObjectValue.entries(sections)
    .map(([tag, content]) => `<${tag}>\n${content}\n</${tag}>`)
    .join(`\n\n`);

export const StructuredPrompt = { create };
