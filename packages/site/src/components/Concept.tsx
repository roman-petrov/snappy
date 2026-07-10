import { _ } from "@snappy/core";
import { $, Text } from "@snappy/ui";
import { Lightbulb } from "lucide-react";

import { t } from "../locales";
import styles from "./Concept.module.scss";
import { IconBadge } from "./IconBadge";
import { Section } from "./Section";
import { Steps } from "./Steps";

export const Concept = () => (
  <Section id="how" lead={t(`concept.lead`)} title={t(`concept.title`)}>
    <Steps items={[t(`concept.step1`), t(`concept.step2`), t(`concept.step3`)]} />
    <div className={_.cn(styles.hint, $.surface(`surface`), $.radius(`lg`))}>
      <IconBadge color="accentViolet" icon={Lightbulb} />
      <div className={styles.body}>
        <Text as="h3" text={t(`concept.hintTitle`)} typography="h3" />
        <Text as="p" text={t(`concept.hintText`)} typography="large" />
      </div>
    </div>
  </Section>
);
