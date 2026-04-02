import { Button, Headline } from "@snappy/ui";

import { t } from "../core";

export const Hero = () => (
  <Headline as="h1" lead={t(`hero.lead`)} title={t(`hero.title`)} variant="hero">
    <Button icon="process" large link={{ href: `/app` }} text={t(`hero.cta`)} type="primary" />
    <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.androidApp`)} />
  </Headline>
);
