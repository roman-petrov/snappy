import { Button, Headline } from "@snappy/ui";

import { t } from "../core";

export const CtaBlock = () => (
  <Headline as="h2" lead={t(`cta.lead`)} title={t(`cta.title`)} variant="section">
    <Button href="https://t.me/sn4ppy_bot" icon="telegram" large primary>
      {t(`cta.button`)}
    </Button>
  </Headline>
);
