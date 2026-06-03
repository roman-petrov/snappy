import { Button } from "@snappy/ui";
import { Wand2 } from "lucide-react";

import { t } from "../locales";
import { PromoBlock } from "./PromoBlock";

export const CtaBlock = () => (
  <PromoBlock
    actions={<Button icon={Wand2} large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />}
    bordered
    lead={t(`cta.lead`)}
    title={t(`cta.title`)}
    titleTypography="h2"
  />
);
