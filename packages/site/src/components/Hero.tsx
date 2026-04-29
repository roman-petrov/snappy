import { Button } from "@snappy/ui";

import { t } from "../locales";
import { Headline } from "./Headline";

export const Hero = () => (
  <Headline as="h1" lead={t(`hero.lead`)} title={t(`hero.title`)} variant="hero">
    <Button icon="wand_stars" large link={{ href: `/app` }} text={t(`hero.cta`)} type="primary" />
    <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.androidApp`)} />
  </Headline>
);
