import DOMPurify from "isomorphic-dompurify";
import { t } from "./Locale";
import { ExampleBlock } from "./ExampleBlock";
import { Section } from "./Section";

const EXAMPLE_KEYS = [`examples.fixErrors`, `examples.friendlyStyle`, `examples.readability`] as const;

export const Examples = () => (
  <Section id="examples" title={t(`examples.title`)} lead={t(`examples.lead`)}>
    {EXAMPLE_KEYS.map(key => (
      <ExampleBlock
        key={key}
        label={t(key)}
        beforeLabel={t(`examples.before`)}
        afterLabel={t(`examples.after`)}
        before={t(`${key}Before`)}
        after={<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(`${key}After`)) }} />}
      />
    ))}
  </Section>
);
