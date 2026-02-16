import { Button } from "@snappy/ui";

import { t } from "../core";
import styles from "./Hero.module.css";

export const Hero = () => (
  <section className={styles.hero}>
    <h1 className={styles.title}>{t(`hero.title`)}</h1>
    <p className={styles.lead}>{t(`hero.lead`)}</p>
    <Button cn={styles.cta} href="https://t.me/sn4ppy_bot" icon="telegram" large primary>
      {t(`hero.cta`)}
    </Button>
  </section>
);
