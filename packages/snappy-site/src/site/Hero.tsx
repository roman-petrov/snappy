import { Button } from "../shared/Button";
import styles from "./Hero.module.css";
import { t } from "./Locale";

const TelegramIcon = () => <span aria-hidden="true" className="icon-telegram" />;

export const Hero = () => (
  <section className={styles[`hero`]}>
    <h1 className={styles[`title`]}>{t(`hero.title`)}</h1>
    <p className={styles[`lead`]}>{t(`hero.lead`)}</p>
    <Button className={styles[`cta`]} href="https://t.me/sn4ppy_bot" large primary>
      <TelegramIcon /> {t(`hero.cta`)}
    </Button>
  </section>
);
