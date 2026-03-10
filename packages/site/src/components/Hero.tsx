import { Button, Headline, Link } from "@snappy/ui";

import { t } from "../core";

export const Hero = () => (
  <Headline as="h1" lead={t(`hero.lead`)} title={t(`hero.title`)} variant="hero">
    <Button href="https://t.me/sn4ppy_bot" icon="telegram" large text={t(`hero.cta`)} type="primary" />
    <Link href="/download/snappy.apk" text={t(`hero.androidApp`)} />
  </Headline>
);
