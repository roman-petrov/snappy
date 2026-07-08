import { Button } from "@snappy/ui";
import { Sparkles } from "lucide-react";

import { AppTags } from "../AppTags";
import { t } from "../locales";
import { PromoBlock } from "./PromoBlock";

export const CtaBlock = () => (
  <PromoBlock
    actions={
      <Button
        icon={Sparkles}
        large
        link={{ href: `/app` }}
        tag={AppTags.site.cta.start}
        text={t(`cta.button`)}
        type="primary"
      />
    }
    bordered
    lead={t(`cta.lead`)}
    note={t(`cta.note`)}
    title={t(`cta.title`)}
    titleTypography="h2"
  />
);
