import { Button, Text } from "@snappy/ui";

import { t } from "../locales";
import styles from "./Hero.module.scss";

export const Hero = () => (
  <section className={styles.root}>
    <Text as="h1" text={t(`hero.title`)} typography="display" />
    <Text cn={styles.lead} text={t(`hero.lead`)} typography="large" />
    <div className={styles.cta}>
      <Button icon="wand_stars" large link={{ href: `/app` }} text={t(`hero.cta`)} type="primary" />
      <Button link={{ href: `/download/snappy.apk` }} text={t(`hero.androidApp`)} />
    </div>
  </section>
);
