import { Button } from "@snappy/ui";
import { Wand2 } from "lucide-react";

import { t } from "../locales";
import { PromoBlock } from "./PromoBlock";

export const Hero = () => (
  <PromoBlock
    actions={
      <>
        <Button icon={Wand2} large link={{ href: `/app` }} text={t(`hero.cta`)} type="primary" />
        <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.androidApp`)} />
      </>
    }
    lead={t(`hero.lead`)}
    title={t(`hero.title`)}
    titleTypography="display"
  />
);
