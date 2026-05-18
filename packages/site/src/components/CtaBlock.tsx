import { Button, Text } from "@snappy/ui";

import { t } from "../locales";
import styles from "./CtaBlock.module.scss";

export const CtaBlock = () => (
  <section className={styles.root}>
    <Text as="h2" text={t(`cta.title`)} typography="h2" />
    <Text cn={styles.lead} text={t(`cta.lead`)} typography="large" />
    <Button icon="wand_stars" large link={{ href: `/app` }} text={t(`cta.button`)} type="primary" />
  </section>
);
