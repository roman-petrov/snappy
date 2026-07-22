// cspell:word aitunnel
import { Link } from "@snappy/ui";
import { Wallet } from "lucide-react";

import { t } from "../locales";
import { HintPanel } from "./HintPanel";
import { Section } from "./Section";
import { Steps } from "./Steps";

export const Pricing = () => (
  <Section id="pricing" lead={t(`pricing.lead`)} title={t(`pricing.title`)}>
    <Steps items={[t(`pricing.step1`), t(`pricing.step2`), t(`pricing.step3`)]} />
    <HintPanel
      actions={
        <>
          <Link
            link={{ href: `https://aitunnel.ru/models`, rel: `noopener noreferrer`, target: `_blank` }}
            text={t(`pricing.aitunnel`)}
          />
          <Link link={{ href: `/terms` }} muted text={t(`pricing.terms`)} />
        </>
      }
      color="accentIndigo"
      description={t(`pricing.hintText`)}
      icon={Wallet}
      title={t(`pricing.hintTitle`)}
    />
  </Section>
);
