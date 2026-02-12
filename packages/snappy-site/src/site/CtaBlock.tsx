import { Button } from "../shared/Button";
import { t } from "./Locale";
import styles from "./CtaBlock.module.css";

const TelegramIcon = () => <span className="icon-telegram" aria-hidden="true" />;

export const CtaBlock = () => (
  <section className={styles[`block`]}>
    <h2 className={styles[`title`]}>{t(`cta.title`)}</h2>
    <p className={styles[`lead`]}>{t(`cta.lead`)}</p>
    <Button href="https://t.me/sn4ppy_bot" primary large className={styles[`cta`]}>
      <TelegramIcon /> {t(`cta.button`)}
    </Button>
  </section>
);
