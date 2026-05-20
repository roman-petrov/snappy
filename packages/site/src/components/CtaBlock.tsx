import { Button } from "@snappy/ui";

import { t } from "../locales";
import { PromoBlock } from "./PromoBlock";

export const CtaBlock = () => (
  <PromoBlock
    actions={<Button icon="wand_stars" large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />}
    bordered
    lead={t(`cta.lead`)}
    title={t(`cta.title`)}
    titleTypography="h2"
  />
);
