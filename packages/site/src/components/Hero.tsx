import { Button } from "@snappy/ui";
import { Sparkles } from "lucide-react";

import { t } from "../locales";
import { PromoBlock } from "./PromoBlock";

export const Hero = () => (
  <PromoBlock
    actions={
      <>
        <Button icon={Sparkles} large link={{ href: `/app` }} text={t(`hero.cta`)} type="primary" />
        <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.android`)} />
      </>
    }
    as="h1"
    lead={t(`hero.lead`)}
    note={t(`hero.note`)}
    title={t(`hero.title`)}
    titleTypography="display"
  />
);
