import { Button, Headline } from "@snappy/ui";

import { t } from "../core";

export const Hero = () => (
  <Headline as="h1" lead={t(`hero.lead`)} title={t(`hero.title`)} variant="hero">
    <Button icon="telegram" large link={{ href: `https://t.me/sn4ppy_bot` }} text={t(`hero.cta`)} type="primary" />
    <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.androidApp`)} />
  </Headline>
);
