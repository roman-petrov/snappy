import { Button, Headline } from "@snappy/ui";

import { t } from "../core";

export const CtaBlock = () => (
  <Headline as="h2" lead={t(`cta.lead`)} title={t(`cta.title`)} variant="section">
    <Button icon="process" large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />
  </Headline>
);
