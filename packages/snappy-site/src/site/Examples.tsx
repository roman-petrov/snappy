import DOMPurify from "isomorphic-dompurify";

import { ExampleBlock } from "./ExampleBlock";
import { t } from "./Locale";
import { Section } from "./Section";

const EXAMPLE_KEYS = [`examples.fixErrors`, `examples.friendlyStyle`, `examples.readability`] as const;

export const Examples = () => (
  <Section id="examples" lead={t(`examples.lead`)} title={t(`examples.title`)}>
    {EXAMPLE_KEYS.map(key => (
      <ExampleBlock
        after={<span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t(`${key}After`)) }} />}
        afterLabel={t(`examples.after`)}
        before={t(`${key}Before`)}
        beforeLabel={t(`examples.before`)}
        key={key}
        label={t(key)}
      />
    ))}
  </Section>
);
