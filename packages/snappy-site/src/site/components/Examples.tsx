import { Text } from "@snappy/ui";

import { t } from "../core";
import { ExampleBlock } from "./ExampleBlock";
import { Section } from "./Section";

export const Examples = () => (
  <Section id="examples" lead={t(`examples.lead`)} title={t(`examples.title`)}>
    {([`examples.fixErrors`, `examples.friendlyStyle`, `examples.readability`] as const).map(key => (
      <ExampleBlock
        after={<Text as="span" html text={t(`${key}After`)} typography="largeBody" />}
        afterLabel={t(`examples.after`)}
        before={t(`${key}Before`)}
        beforeLabel={t(`examples.before`)}
        key={key}
        label={t(key)}
      />
    ))}
  </Section>
);
