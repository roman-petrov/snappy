import { Button, Headline } from "@snappy/ui";

import { t } from "../core";

export const Hero = () => (
  <Headline as="h1" lead={t(`hero.lead`)} title={t(`hero.title`)} variant="hero">
    <Button href="https://t.me/sn4ppy_bot" icon="telegram" large primary>
      {t(`hero.cta`)}
    </Button>
  </Headline>
);
