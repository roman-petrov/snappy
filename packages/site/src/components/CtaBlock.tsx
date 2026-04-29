import { Button } from "@snappy/ui";

import { t } from "../locales";
import { Headline } from "./Headline";

export const CtaBlock = () => (
  <Headline as="h2" lead={t(`cta.lead`)} title={t(`cta.title`)} variant="section">
    <Button icon="wand_stars" large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />
  </Headline>
);
