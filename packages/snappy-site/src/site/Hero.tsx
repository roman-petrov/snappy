import { Button } from "../shared/Button";
import { t } from "./Locale";
import styles from "./Hero.module.css";

const TelegramIcon = () => <span className="icon-telegram" aria-hidden="true" />;

export const Hero = () => (
  <section className={styles[`hero`]}>
    <h1 className={styles[`title`]}>{t(`hero.title`)}</h1>
    <p className={styles[`lead`]}>{t(`hero.lead`)}</p>
    <Button href="https://t.me/sn4ppy_bot" primary large className={styles[`cta`]}>
      <TelegramIcon /> {t(`hero.cta`)}
    </Button>
  </section>
);
